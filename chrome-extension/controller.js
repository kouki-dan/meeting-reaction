
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
}

const registerPanel = () => {
  const panelHtml = `
  <div style="position: absolute; z-index: 1000; width: 80px; height: 80px; border-radius: 40px; text-align: center; line-height: 80px; left: 2rem; bottom: 2rem; background-color: rgba(10, 100, 100, 0.6);">
    Claps
  </div>
  `

  const node = document.createElement("div");
  node.innerHTML = panelHtml;
  node.addEventListener("click", () => {
    const storage = meetingReactionFirebase.storage();
    const clappingRef = storage.ref("$common/clapping1.mp3");
    clappingRef.getDownloadURL().then(url => {
      loadFileAndPlay(url);
    })     
  }, true);
  document.body.appendChild(node);
}

const panelReady = () => {
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