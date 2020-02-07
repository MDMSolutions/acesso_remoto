const PORT = process.env.PORT || 3000;
var app = require('express')();
const path = require('path');
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.send(`
    conexões - ${Object.keys(io.sockets.adapter.rooms).join(" ### ")} --
  `);
});

app.get('/peer', (req, res) => {
  res.sendFile(path.join(__dirname+'/index.html'));
})

app.use(express.static('public'))

io.on('connection', socket => {
  let roomGeneral

  socket.on('create or join room', (roomName) => {
    roomGeneral = roomName
    socket.join(roomGeneral, () => {
      io.to(roomGeneral).emit('joined to room', roomGeneral)

      console.log(`connected to room: ${roomGeneral}`)
    });
  });

  socket.on("offer", offer => {
    io.to(roomGeneral).emit('receive offer', offer)

    console.log("Offer:", offer)
    console.log(`offer emited to room: ${roomGeneral}`)
  })

  socket.on('answer', (answer) => {
    io.to(roomGeneral).emit('receive answer', answer)

    console.log("Answer:", answer)
    console.log(`answer emited to room: ${roomGeneral}`)
  })

  socket.on('disconnect', () => {
    console.log(`disconnected from ${roomGeneral}`)
  });

});

http.listen(PORT, function () {
  console.log('listening on *:' + PORT);
});
