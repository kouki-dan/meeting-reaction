import Head from 'next/head'
import { useEffect, useState } from 'react';
import firebase from 'firebase';
import { useRouter } from 'next/dist/client/router';

function playRemote(id: string, ref: firebase.storage.Reference) {
  const db = firebase.firestore();
  db.collection(`meet/${id}/sounds`).add({
    fullPath: ref.fullPath,
    sentAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

async function downloadAndPlayLocal(ref: firebase.storage.Reference) {
  const url = await ref.getDownloadURL();
  var audio = new Audio(url);
  audio.play();
}

export default function Meet() {
  const router = useRouter();
  const id: string = router.query.id as string;

  const [commonFiles, setCommonFiles] = useState<firebase.storage.Reference[]>([]);
  const [files, setFiles] = useState<firebase.storage.Reference[]>([]);
  const [reload, setReload] = useState(false);
  useEffect(() => {
    const storage = firebase.storage();
    storage.ref("common").listAll().then((res) => {
      setCommonFiles(res.items)
    });
  }, [])
  useEffect(() => {
    const storage = firebase.storage();
    storage.ref(`meet/${id}`).listAll().then((res) => {
      setFiles(res.items)
    });
    if (reload) {
      setReload(false);
    }
  }, [id, reload]);

  return (
    <div className="container">
      <Head>
        <title>Meet for Meeting Reaction</title>
      </Head>
      <h1>Google Meet: <a href={"https://meet.google.com/"+id}>{ id }</a></h1>
      <h2>Common Sounds <span style={{fontSize: "0.8rem"}}>powered by: <a href="https://taira-komori.jpn.org/">https://taira-komori.jpn.org/</a></span></h2>
      <ul>
        {
          commonFiles.map(x => (
            <li key={x.name}>
              Name: {x.name}<br/>
              <button onClick={ () => { playRemote(id, x)}}>Click to play</button>
              <button onClick={ () => { downloadAndPlayLocal(x)}}>Try it on local</button>
            </li>
          ))
        }
      </ul>
      <h2>Original Sounds for <a href={"https://meet.google.com/"+id}>{ id }</a></h2>
      <label>
        Add new sound file.<br/>
        <input type="file" onChange={(event) => {
          const storage = firebase.storage();
          const file = event.target.files[0];
          const input = event.target;
          if (!file) {
            return;
          }
          storage.ref(`meet/${id}/${file.name}`).put(file).then(() => {
            alert("Success!");
            input.value = null;
            setReload(true);
          }).catch(() => {
            alert("Failed to upload");
          })
        }}/>
      </label>
      <ul>
        {
          files.map(x => (
            <li key={x.name}>
              Name: {x.name}<br/>
              <button onClick={ () => { playRemote(id, x)}}>Click to play</button>
              <button onClick={ () => { downloadAndPlayLocal(x)}}>Try it on local</button>
            </li>
          ))
        }
      </ul>
    </div>
  );
}