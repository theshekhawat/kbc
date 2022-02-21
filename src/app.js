var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.get('/', function(req, res) {
   res.sendfile(path.resolve('index.html'));
});

// handle incoming connections from clients
io.sockets.on('connection', function(socket) {
   // once a client has connected, we expect to get a ping from them saying what room they want to join
   socket.on('room', function(room) {
       socket.join(room);
   });
});

// now, it's easy to send a message to just the clients in a given room
room = "abc123";
io.sockets.in(room).emit('message', 'what is going on, party people?');

// this message will NOT go to the client defined above
io.sockets.in('foobar').emit('message', 'anyone in this room yet?');

http.listen(3000, function() {
   console.log('listening on localhost:3000');
});