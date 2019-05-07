var socket = io();

var spaceship = new Image();
spaceship.src = "static/assets/images/ufo.svg";

var asteroid = new Image();
asteroid.src = "static/assets/images/asteroid.svg";
var mars = new Image();
mars.src = "static/assets/images/mars.svg";
var jupiter = new Image();
jupiter.src = "static/assets/images/jupiter.svg";

const images = [asteroid, mars, jupiter];

var nameButton = document.getElementById("name-button");
var input = document.getElementById(nameInput);
nameButton.onclick = function () {
  socket.emit('new player', nameInput.value);
  document.getElementById('preload').style.visibility = "hidden";
}

var movement = {
  up: false,
  down: false,
  left: false,
  right: false
}

document.addEventListener('keydown', function (event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = true;
      break;
    case 87: // W
      movement.up = true;
      break;
    case 68: // D
      movement.right = true;
      break;
    case 83: // S
      movement.down = true;
      break;
  }
});
document.addEventListener('keyup', function (event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      break;
    case 87: // W
      movement.up = false;
      break;
    case 68: // D
      movement.right = false;
      break;
    case 83: // S
      movement.down = false;
      break;
  }
});

setInterval(function () {
  socket.emit('player-action', movement);
}, 1000 / 60);

var readyButton = document.getElementById("ready-button");
var waiting = document.getElementById("waiting");
readyButton.onclick = function () {
  socket.emit('ready');
  readyButton.style.visibility = 'hidden';
  waiting.style.visibility = 'visible';
}

socket.on('game-started', () => waiting.style.visibility = 'hidden');

var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');

socket.on('update', gameLoop);

function gameLoop(state) {
  context.clearRect(0, 0, 800, 600);
  if (!state.winner) {
    drawPlayers(state.players);
    drawEnemies(state.enemies, state.players[socket.id]);
  } else {
    drawWinner(state.winner, state.winnerScore);
  }
}

function drawPlayers(players) {
  var space = 20;
  for (var id in players) {
    var player = players[id];
    context.fillStyle = player.color;
    context.font = "16px Arial";
    if (player.state.isAlive) {
      context.drawImage(spaceship, player.state.pos.x, player.state.pos.y, 50, 50);
      context.fillText(player.name, player.state.pos.x, player.state.pos.y + 50);
    }
    context.fillText(player.name + ": " + player.state.score, 700, space);
    space += 20;
  }
}

function drawEnemies(enemies, player) {
  enemies.forEach(function (enemy) {
    context.drawImage(images[enemy.img], enemy.x, enemy.y, enemy.size, enemy.size);
    if (
      enemy.x + enemy.size - 20 > player.state.pos.x &&
      enemy.x < player.state.pos.x + 40 &&
      player.state.pos.y < (enemy.y + enemy.size) * 0.95 &&
      player.state.pos.y + 30 > enemy.y
    ) {
      socket.emit('player-collided');
      readyButton.style.visibility = "visible";
    }
  });
}

function drawWinner(winner, winnerScore) {
  context.fillStyle = "rgba(100, 0, 0, 0.5)";
  context.fillRect(100, 100, 600, 400);
  context.fillStyle = "white";
  context.font = "30px Arial";
  context.fillText("Winner: " + winner.name, 300, 270);
  context.font = "16px Arial";
  context.fillText("score: " + winnerScore, 350, 330);
  readyButton.style.visibility = readyButton.style.visibility == "visible" ? "visible" : "hidden";
}