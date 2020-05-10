async function load () {
  const script = await textContentScript("script.js")
  document.body.insertBefore(script, document.body.firstChild)

  const controllerScript = await textContentScript("controller.js");
  setTimeout(() => {
    let scripts = [
      "https://www.gstatic.com/firebasejs/6.2.0/firebase-app.js",
      "https://www.gstatic.com/firebasejs/6.2.0/firebase-firestore.js",
      "https://www.gstatic.com/firebasejs/6.2.0/firebase-storage.js",
    ].map(url => urlScript(url));
    scripts.push(controllerScript);

    let firstChild = document.body.firstChild;
    const fragment = document.createDocumentFragment();
    scripts.forEach((script) => {
      fragment.appendChild(script);
    });
    document.body.insertBefore(fragment, firstChild)
  }, 100);
}

const textContentScript = async (filename) => {
  const res = await fetch(chrome.runtime.getURL(filename), { method: "GET" });
  const js = await res.text();
  const script = document.createElement("script");
  script.textContent = js;
  return script;
}

const urlScript = (url) => {
  const script = document.createElement("script");
  script.src = url;
  return script;
}

load();