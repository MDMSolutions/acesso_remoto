var socket = io();

$(function () {
  socket.emit('create room', "pulsus-Acme Inc-5");
});
