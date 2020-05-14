
const main = () => {
  // debugger
  registerPanel();
}

let meetingReactionFirebase;
const initializeFirebase = () => {
  // TODO: Extract to configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAH2-_dPcxz1QWMbAfSQ4bKQ2QPDMJR0X4",
    authDomain: "meeting-reaction.firebaseapp.com",
    databaseURL: "https://meeting-reaction.firebaseio.com",
    projectId: "meeting-reaction",
    storageBucket: "meeting-reaction.appspot.com",
    messagingSenderId: "23732702197",
    appId: "1:23732702197:web:afbbd923ec013d98602ebc",
    measurementId: "G-Z6CWYP6160"
  };

  meetingReactionFirebase = firebase.initializeApp(firebaseConfig);

  let skippedFirst = false;
  const db = meetingReactionFirebase.firestore();
  db.collection(`meet${location.pathname}/sounds`)
    .orderBy("sentAt", "desc")
    .limit(1)
    .onSnapshot((snapshot) => {
      if (!skippedFirst) {
        skippedFirst = true;
        return
      }
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const fullPath = change.doc.data().fullPath;
          if (`/${fullPath}`.startsWith(location.pathname) || fullPath.startsWith("common")) {
            // Ignore invalid path
            const storage = meetingReactionFirebase.storage();
            const storageRef = storage.ref(fullPath);
            storageRef.getDownloadURL().then(url => {
              loadFileAndPlay(url);
            });
          }
        }
      });
  });
}

let panelStringNode;
let panelNode;
const registerPanel = () => {
  panelNode = document.createElement("div");
  panelStringNode = document.createElement("div")
  panelStringNode.style.lineHeight = "80px";
  panelStringNode.style.width = "80px"; 
  panelStringNode.style.height = "80px";
  panelStringNode.style.cursor = "pointer";
  panelStringNode.innerText = "Loading...";
  panelNode.appendChild(panelStringNode);
  panelNode.style.position = "absolute";
  panelNode.style.zIndex = 1000;
  panelNode.style.borderRadius = "40px";
  panelNode.style.textAlign = "center";
  panelNode.style.left = "2rem"; 
  panelNode.style.bottom = "2rem";
  panelNode.style.backgroundColor = "rgba(100, 100, 100, 0.6)";;

  panelStringNode.addEventListener("click", () => {
    const url = `https://${meetingReactionFirebase.options_.projectId}.web.app/meet${location.pathname}`;
    navigator.clipboard.writeText(url);
    panelStringNode.innerText = "URL Copied";
    setTimeout(() => {
      panelStringNode.innerText = "Ready!";
    }, 2000);
  }, true);

  const help = document.createElement("div");
  help.innerHTML = `
    This circle is provided by <a target="_blank" href='https://github.com/kouki-dan/meeting-reaction'>Meeting Reaction</a><br/>
    Get URL and share it with attendees by clicking this circle. Attendees can send sound effects to this meeting in this URL.<br/>
    If you don't need this, remove extention from <a target="_blank" href="chrome://extensions/">here</a>.
  `
  help.style.position = "absolute";
  help.style.display = "none";
  help.style.bottom = "80px";
  help.style.padding = "1rem";
  help.style.width = "20rem";
  help.style.lineheight = "1.2rem";
  help.style.backgroundColor = "rgba(200, 200, 200, 0.8)";
  panelNode.appendChild(help);

  document.body.appendChild(panelNode);

  panelNode.addEventListener("mouseover", () => {
    help.style.display = "block";
  }, true);
  panelNode.addEventListener("mouseout", () => {
    help.style.display = "none";
  }, true);
}

const panelReady = () => {
  panelStringNode.innerText = "Ready!";
  panelNode.style.backgroundColor = "rgba(82, 250, 152, 0.7)";
}

if (readyForAudioProxy) {
  panelReady();
} else {
  document.addEventListener("ready_for_audio_proxy", (function (x) {
    return function f() {
      panelReady()
      document.removeEventListener("ready_for_audio_proxy", f, true);
    }
  }()), true);
}

window.addEventListener("load", () => {
  initializeFirebase();
}, true);

main();