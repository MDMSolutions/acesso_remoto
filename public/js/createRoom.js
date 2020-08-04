var socket = io();

$(function () {
  socket.emit('create room', "pulsus-Acme Inc-5");
  socket.on("disconnect", some => {
    console.log("disconectado")
  })
});
