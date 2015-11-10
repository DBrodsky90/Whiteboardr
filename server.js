var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io')(server);

app.set('port', (process.env.PORT || 8000));

app.use(express.static('public'));

io.on('connection', function(client) {
	console.log("Client has connected...");

	client.on('chat message', function(msg) {
		io.emit('add chat message', msg);
	});

	client.on('drawing', function(data) {
		client.broadcast.emit('add drawing', data);
	});

	client.on('send last coords', function(data) {
		client.broadcast.emit('set last coords', data);
	})

	client.on('disconnect', function() {
		console.log("Client has disconnected...");
	});

});

server.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + app.get('port'));
});



