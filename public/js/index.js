var socket = io();

$(function () {
  socket.emit('create or join room', "pulsus-Acme Inc-5");

  socket.on("disconnect", some => {
    console.log("disconectado")
  })
});

function initPeer() {
  navigator.getUserMedia({ video: true, audio: true }, sendOffer, () => {})
}

function sendOffer(stream) {
  const peer = new SimplePeer({
    channelName: "pulsus-Acme Inc-5",
    initiator: true,
    stream: stream,
    config: { iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun.services.mozilla.com' },
      {
        urls: 'turn:turn.bistri.com:80',
        username: "homeo",
        credential: "homeo"
      },
      {
        urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
        username: "webrtc",
        credential: "webrtc"
      },
    ]}
  })

  peer.on('signal', data => {
    console.log(data)
    if(data.type === "offer") {
      socket.emit('offer', JSON.stringify(data))
    } else {
      socket.emit('offer candidate', JSON.stringify(data))
    }
  })

  socket.on("receive answer", answer => {
    console.log("answer received")
    console.log(answer)
    peer.signal(JSON.parse(answer.replace(/\r\n/g, "\\r\\n")))
  })

  socket.on("receive answer candidate", candidate => {
    console.log(candidate)
    peer.signal(JSON.parse(candidate));
  })
}