function Player(id, name) {
    this.id = id;
    this.name = name;
    this.color = Player.COLORS[Math.floor(Math.random() * 9)];

    this.state = {
        pos: {
            x: 300,
            y: 300
        },
        isReady: false,
        isAlive: true,
        score: 0
    }
}

Player.SPEED = 5;

Player.hitboxSize = 50;

Player.COLORS = ["red", "blue", "green", "yellow", "brown", "orange", "pink", "purple", "gray"];

Player.MIN_X = 0;

Player.MAX_X = 750;

Player.MIN_Y = 0;

Player.MAX_Y = 545;

Player.generateNewPlayer = function (socket, name) {
    return new Player(socket.id, name);
};

Player.prototype.updateState = function (data) {
    if (data.left && this.state.pos.x > Player.MIN_X) {
        this.state.pos.x -= Player.SPEED;
    }
    if (data.up && this.state.pos.y > Player.MIN_Y) {
        this.state.pos.y -= Player.SPEED;
    }
    if (data.right && this.state.pos.x < Player.MAX_X) {
        this.state.pos.x += Player.SPEED;
    }
    if (data.down && this.state.pos.y < Player.MAX_Y) {
        this.state.pos.y += Player.SPEED;
    }
};

module.exports = Player;