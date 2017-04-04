// Tout d'abbord on initialise notre application avec le framework Express 
// et la bibliothèque http integrée à node.
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// On gère les requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
app.use("/", express.static(__dirname + "/public"));

// On lance le serveur en écoutant les connexions arrivant sur le port 3000
http.listen(3000, function() {
	console.log('Server is listening on *:3000');
});

io.on('connection', onConnection);

var users = [];  
var loggedUser;

function onConnection(socket) {
	socket.on('disconnect', onDisconnect);
	socket.on('user-login', onUserLogin);
	socket.on('player-move', onPlayerMove);

	for (i = 0; i < users.length; i++) {
		socket.emit('user-login', users[i]);
	}

	function onDisconnect() {
		if (loggedUser !== undefined) {
			
			// Broadcast d'un 'service-message'
			var serviceMessage = {
				text: 'User "' + loggedUser.name + '" disconnected',
				type: 'logout'
			};
			socket.broadcast.emit('service-message', serviceMessage);
			
			// Suppression de la liste des connectés
			var userIndex = users.indexOf(loggedUser);
			if (userIndex !== -1) {
				users.splice(userIndex, 1);
			}
			// Emission d'un 'user-logout' contenant le user
			io.emit('user-logout', loggedUser);
		}
	}	

	function onPlayerMove(player) {
		// console.log('server player-move received');
		loggedUser = player;
		socket.broadcast.emit('player-moved', player);
	};

	function onUserLogin (user, callback) {
		var userIndex = -1;
		for (i = 0; i < users.length; i++) {
			if (users[i].name === user.name) {
				userIndex = i;
			}
		}
		var isPlayerNew = user !== undefined && userIndex === -1;
		if (isPlayerNew) {
			saveNewPlayer(user);
			informPlayerLoggedIn(socket, loggedUser);
			confirmLogin(loggedUser, callback);
			socket.broadcast.emit('user-login', loggedUser);
		} 
		else {
			callback(false);
		}
	}

}


function saveNewPlayer(user) {
	loggedUser = user;
	users.push(loggedUser);
}

function informPlayerLoggedIn(socket, user) {
	var userServiceMessage = {
		text: 'You logged in as "' + user.name + '"',
		type: 'login'
	};
	var broadcastedServiceMessage = {
		text: 'User "' + user.name + '" logged in',
		type: 'login'
	};
	socket.emit('service-message', userServiceMessage);
	socket.broadcast.emit('service-message', broadcastedServiceMessage);	
}

function confirmLogin(user, callback) {
	io.emit('user-logged', user);
	callback(true);
}
