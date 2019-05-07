var Player = require("./Player"),
    Enemy = require("./enemy");

function Game() {
    this.players = {};
    this.enemies = [];

    this.isRolling = false;
    this.winner = null;
    this.winnerScore = 200;
}

Game.ENEMIES_CREATION_INTERVAL = 800;

Game.prototype.onReady = function () {
    this.winner = null;
    this.enemiesInterval = setInterval(() => this.createNewEnemy(this.enemies), Game.ENEMIES_CREATION_INTERVAL);
    this.isRolling = true;
};

Game.prototype.createNewEnemy = function (enemies) {
    var randImg = Math.floor(Math.random() * Enemy.NUMBER_OF_TYPES);
    var randSize = (Math.random() * (Enemy.MAX_SIZE - Enemy.MIN_SIZE)) + Enemy.MIN_SIZE;
    var randy = Math.random() * (600 - randSize);
    var enemy = Enemy.generateNewEnemy(randImg, Enemy.STARTING_X, randy, randSize);
    var length = enemies.push(enemy);
    if (length > 10) {
        enemies.splice(0, 1);
    }
};

Game.prototype.addNewPlayer = function (socket, name) {
    this.players[socket.id] = Player.generateNewPlayer(socket.id, name);
    console.log("generated player: " + this.getPlayerBySocketId(socket.id).name);
};

Game.prototype.playerReady = function (id) {
    var player = this.getPlayerBySocketId(id);
    if (player) {
        player.state.isReady = true;
        for (var id in this.players) {
            if (!this.players[id].state.isReady) return false;
        }
        this.onReady();
        return true;
    }
};

Game.prototype.playerCollided = function (id) {
    var player = this.getPlayerBySocketId(id);
    if (player && this.isRolling) {
        player.state.isAlive = false;
        for (var playerId in this.players) {
            if (this.players[playerId].state.isAlive) return;
        }
        this.endGame(id);
    }
};

Game.prototype.endGame = function (winnerId) {
    this.isRolling = false;
    var player = this.getPlayerBySocketId(winnerId);
    clearInterval(this.enemiesInterval);
    this.enemies = [];
    this.winnerScore = player.state.score;
    this.resetPlayersState();
    this.winner = player;
};

Game.prototype.resetPlayersState = function () {
    for (var id in this.players) {
        var player = this.players[id];
        if (player) {
            player.state.pos.x = 300;
            player.state.pos.y = 300;
            player.state.isAlive = true;
            player.state.isReady = false;
            player.state.score = 0;
        }
    }
};

Game.prototype.updatePlayer = function (socket, data) {
    var player = this.getPlayerBySocketId(socket.id);
    if (player) {
        player.updateState(data);
    }
};

Game.prototype.update = function () {
    if (this.isRolling) {
        for (var id in this.players) {
            if (this.players[id].state.isAlive) {
                this.players[id].state.score += 1;
            }
        }
    }
    this.enemies.forEach(function (enemy) {
        enemy.updateState(enemy.x - Enemy.SPEED);
    });
};

Game.prototype.sendState = function () {
    return {
        players: this.players,
        enemies: this.enemies,
        winner: this.winner,
        winnerScore: this.winnerScore
    }
};

Game.prototype.getPlayerBySocketId = function (id) {
    var player = this.players[id];
    if (player) {
        return player;
    }
    return null;
};


module.exports = Game;