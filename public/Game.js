var Game = function(selector, width, height, players) {
	this.selector = selector;
	this.width = width;
	this.height = height;
	this.players = players;
	this.init();
};

Game.prototype.init = function init() {
	var container = document.querySelector(this.selector);
	var canvas = document.createElement('canvas');
	canvas.setAttribute('width', this.width);
	canvas.setAttribute('height', this.height);
	canvas.style.width = this.width + 'px';
	canvas.style.height = this.height + 'px';
	container.appendChild(canvas);
	this.canvas = canvas;
	this.ctx = this.canvas.getContext('2d');
	this.loaded = true;
	this.run();
};

Game.prototype.run = function run() {
	var self = this;
	this.timer = setInterval(function() {
		self.draw();
	}, 1000 / 30);
};

Game.prototype.draw = function draw() {
	this.ctx.clearRect(0, 0, this.width, this.height);
	for (var i = 0; i < this.players.length; i++) {
		this.players[i].draw(this.ctx);
	}
};

