var socket = io();
var players = [];
var user;
var player;
var game;

$('#login form').submit(onLoginFormSubmit);
$('form').submit(onMessageFormSubmit);
document.onkeydown = onKeydown;
document.onkeyup = onKeyup;
socket.on('chat-message', onChatMessage);
socket.on('service-message', onServiceMessage);
socket.on('player-moved', onPlayerMoved);
socket.on('user-login', onUserLogin);
socket.on('user-logged', onUserLogged);
socket.on('user-logout', onUserLogout);


function onLoginFormSubmit(e) {
	e.preventDefault();
	user = { name: $('#login input').val().trim() };
	if (user.name.length > 0) {
		console.log('onLoginFormSubmit user: ' + JSON.stringify(user));
		socket.emit('user-login', user, function (success) {
			if (success) {
				hideLoginForm();
				player = new Player(
					user.name,
					200,
					200
				);
				players.push(player);
				game = new Game('#game', 640, 480, players, gameUpdate);
			}
		});
	}
}

function onMessageFormSubmit(e) {
    e.preventDefault();

    var message = {
        text : $('#m').val()
    };
	
    if (message.text.trim().length !== 0) {
      socket.emit('chat-message', message);
    }
	
}

function onKeydown(e) {
	// console.log(e.keyCode);
	if (game && game.loaded) {
		// debugger;
		if (e.keyCode === 37) {
			game.keyboard.LEFT = true;
		}
		else if (e.keyCode === 39) {
			game.keyboard.RIGHT = true;
		}
		if (e.keyCode === 38) {
			game.keyboard.TOP = true;
		}
		else if (e.keyCode === 40) {
			game.keyboard.BOTTOM = true;
		}
	}
}

function onKeyup(e) {
	if (game && game.loaded) {
		if (e.keyCode === 37) {
			game.keyboard.LEFT = false;
		}
		else if (e.keyCode === 39) {
			game.keyboard.RIGHT = false;
		}
		if (e.keyCode === 38) {
			game.keyboard.TOP = false;
		}
		else if (e.keyCode === 40) {
			game.keyboard.BOTTOM = false;
		}
	}
}

function gameUpdate() {
	if (game.keyboard.LEFT) {
		player.move('LEFT');
		socket.emit('player-move', player);
	}
	else if (game.keyboard.RIGHT) {
		player.move('RIGHT');
		socket.emit('player-move', player);
	}
	if (game.keyboard.TOP) {
		player.move('TOP');
		socket.emit('player-move', player);
	}
	else if (game.keyboard.BOTTOM) {
		player.move('BOTTOM');
		socket.emit('player-move', player);
	}
}

function onChatMessage(message) {  
	$('#messages').prepend($('<li>').html('<span class="username">' + message.name + '</span> ' + message.text));
}

function onServiceMessage(message) {  
	$('#messages').prepend($('<li class="' + message.type + '">').html('<span class="info">information</span> ' + message.text));
}

function onPlayerMoved(player) {
	for (var i = 0; i < players.length; i++) {
		if (players[i].name === player.name) {
			// debugger;
			players[i].x = parseInt(player.x, 10);
			players[i].y = parseInt(player.y, 10);
			return;
		}
	}
	console.error('player moved not found');
}

function onUserLogin(newUser) {
	$('#players').append($('<li class="' + newUser.name + ' new">').html(newUser.name));
	addPlayer(newUser.name, 200, 200);
	setTimeout(function () {
		$('#players li.new').removeClass('new');
	}, 1000);
}

function onUserLogged(newUser) {
	console.log("You're logged");
}

function onUserLogout(user) {  
	var selector = '#players li.' + user.name;
	$(selector).remove();
}

function hideCnxForm() {
	$('body').removeAttr('id');
}

function hideLoginForm() {
	$('body').removeAttr('id'); // Cache formulaire de connexion
}

function addPlayer(name, x, y) {
	var posX = x || Math.floor(Math.random() * 630);
	var posY = y || Math.floor(Math.random() * 470);
	var player = new Player(
		name,
		posX,
		posY
	);
	players.push(player);
	console.log("new player added!", player);
}
