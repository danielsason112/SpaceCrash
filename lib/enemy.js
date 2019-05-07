function Enemy(img, x, y, size) {
    this.img = img,
        this.x = x,
        this.y = y,
        this.size = size;
}

Enemy.SPEED = 15;

Enemy.NUMBER_OF_TYPES = 3;

Enemy.STARTING_X = 900;

Enemy.MIN_SIZE = 50;

Enemy.MAX_SIZE = 180;

Enemy.generateNewEnemy = function (img, x, y, size) {
    return new Enemy(img, x, y, size);
}

Enemy.prototype.updateState = function (x) {
    this.x = x;
}

module.exports = Enemy;