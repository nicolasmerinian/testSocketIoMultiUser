var Player = function(name, x, y) {
	this.name = name;
	this.x = x;
	this.y = y;
	this.speed = 4;
	this.color = getRandomColor();
	this.drawn = false;
};

Player.prototype.toString = function toString() {
	return 'Player { name: ' + this.name + ', (' + this.x + ', ' + this.y + ') }';
};

Player.prototype.draw = function draw(ctx) {
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x, this.y, 10, 10);
	if (this.drawn === false) {
		this.drawn = true;
	}
};

Player.prototype.move = function move(direction) {
	if (direction === 'LEFT') {
		this.x -= this.speed;
	}
	else if (direction === 'TOP') {
		this.y -= this.speed;
	}
	else if (direction === 'RIGHT') {
		this.x += this.speed;
	}
	else if (direction === 'BOTTOM') {
		this.y += this.speed;
	}
};

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}