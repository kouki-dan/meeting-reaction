  
let fileCache = {};
const loadBuffer = async (fileUrl) => {
    const cachedBuffer = fileCache[fileUrl];
    if (cachedBuffer) {
        return cachedBuffer;
    }
    const res = await fetch(fileUrl);
    const arrayBuffer = await res.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    fileCache[fileUrl] = audioBuffer;
    return audioBuffer;
}
const loadFileAndPlay = async (fileUrl) => {
  const source = audioContext.createBufferSource();
  source.buffer = await loadBuffer(fileUrl);
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0.2;
  gainNode.connect(audioDestination);
  source.connect(gainNode);
  source.start();
}

let audioContext;
let audioDestination;
let readyForAudioProxy = false;
const addMediaProxy = () => {
  // debugger
  audioContext = new AudioContext();
  audioDestination = audioContext.createMediaStreamDestination();

  navigator.mediaDevices._getUserMedia = navigator.mediaDevices.getUserMedia;
  navigator.mediaDevices.getUserMedia = function (constraints) {
    return new Promise((resolve, reject) => {
      const desktopAudio = constraints?.audio?.mandatory?.chromeMediaSource === 'system'

      navigator.mediaDevices._getUserMedia(constraints)
        .then((stream) => {
          if (constraints.audio && !desktopAudio) {
            readyForAudioProxy = true;
            var event = new CustomEvent("ready_for_audio_proxy");
            document.dispatchEvent(event);

            const audioTrack = stream.getAudioTracks()
            const originalMicSource = audioContext.createMediaStreamSource(stream)
            originalMicSource.connect(audioDestination)
            if (audioTrack.length >= 1) {
              stream.removeTrack(audioTrack[0])
              stream.addTrack(audioDestination.stream.getAudioTracks()[0])
            }
          }
          resolve(stream)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

addMediaProxy()