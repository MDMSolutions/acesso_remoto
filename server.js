const PORT = process.env.PORT || 5000;
const express = require('express');
const app = express();
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.set('view engine', 'pug')

app.get('/', (req, res) => {
  const rooms = Object.keys(io.sockets.adapter.rooms)
  console.log(rooms)
  res.render('health', {rooms})
});

app.get('/peer', (req, res) => {
  res.render('peer')
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

  socket.on("offer candidate", candidate => {
    io.to(roomGeneral).emit('receive offer candidate', candidate)

    console.log("offer candidate:", candidate)
    console.log(`offer candidate emited to room: ${roomGeneral}`)
  })

  socket.on('answer', (answer) => {
    io.to(roomGeneral).emit('receive answer', answer)

    console.log("Answer:", answer)
    console.log(`answer emited to room: ${roomGeneral}`)
  })

  socket.on("answer candidate", candidate => {
    io.to(roomGeneral).emit('answer offer candidate', candidate)

    console.log("answer candidate:", candidate)
    console.log(`answer candidate emited to room: ${roomGeneral}`)
  })

  socket.on('disconnect', () => {
    io.to(roomGeneral).emit('instance disconnect')
    console.log(`disconnected from ${roomGeneral}`)
  });

});

http.listen(PORT, function () {
  console.log('listening on *:' + PORT);
});
