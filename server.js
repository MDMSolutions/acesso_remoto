const PORT = process.env.PORT || 3000;
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  let roomGeneral
  
  socket.on('create or join room', (roomName) => {
    roomGeneral = roomName
    socket.join(roomGeneral);
    socket.emit('joined to room', roomGeneral)

    console.log(`connected to room: ${roomGeneral}`)
  });

  socket.on('answer an offer', (answer) => {
    io.to(roomGeneral).emit('answer', answer)

    console.log(`answer emited to room: ${roomGeneral}`)
  })

  socket.on('disconnect', function(){
    console.log(`disconnected from ${roomGeneral}`)
  });

});

http.listen(PORT, function () {
  console.log('listening on *:' + PORT);
});