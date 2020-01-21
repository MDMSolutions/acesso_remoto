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
  });

  socket.on('answer an offer', (answer) => {
    io.to(roomGeneral).emit('answer', answer)
  })

  socket.on('disconnect', function(){
    console.log('disconnected')
  });

});

http.listen(8888, function () {
  console.log('listening on *:8888');
});