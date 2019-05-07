// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

var Game = require("./lib/game");

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, function () {
  console.log('Starting server on port 5000');
});

var game = new Game();

io.on('connection', function (socket) {
  socket.on('new player', function (name) {
    game.addNewPlayer(socket, name);
  });
  socket.on('player-action', function (data) {
    game.updatePlayer(socket, data);
  });
  socket.on('ready', function () {
    if (game.playerReady(socket.id)) {
      io.sockets.emit('game-started');
    }
  });
  socket.on('player-collided', function () {
    game.playerCollided(socket.id);
  });
});

setInterval(function () {
  game.update();
  io.sockets.emit('update', game.sendState());
}, 1000 / 60);