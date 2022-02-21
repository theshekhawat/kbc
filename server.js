const express = require('express');
var app = express();
var server = require('http').createServer(app);
const options = {
   perMessageDeflate: false
};
var io = require('socket.io')(server, options);

app.use(express.static(__dirname + '/dist/game-show'));

var roomno = 1;

io.on('connection', socket => {

   //Increase roomno 2 clients are present in a room.
   // if (io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1)
   // {
   //    roomno++;
   // }
   // socket.join("room-" + roomno);
   // console.log("Joined Room: " + roomno);
   // //Send this event to everyone in the room.
   // io.sockets.in("room-" + roomno).emit('connectedToRoom', "You are in room no. " + roomno);
   // //io.to(roomno).emit('some event inside room: ' + roomno);

   // socket.emit('testerEvent', { description: 'A custom event named testerEvent!' });

   socket.on('new-message', function () {
      console.log('Coming from Angular');
   });

   socket.on('join-new-room', function (roomName) {
      socket.join(roomName);
      console.log('Joined new Room: ' + roomName);
      socket.emit('testerEvent', { description: 'A custom event named testerEvent!' });
   });
});

server.listen(3000, () => {
   console.log('listening on localhost:3000');
});