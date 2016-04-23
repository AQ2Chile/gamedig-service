var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var gamedig = require('gamedig');
http.listen(2000);

gamedig.fetchServer = function(port, _fnCallback) {
	return new Promise(function(resolve, reject) {
		gamedig.query({
			type: 'quake2',
			host: 'server.aq2chile.cl',
			port: port
		}, function(state) {
			if(state.error) reject({'error':'gamedig error'});
			else resolve(state);
		});
	});
}

app.get('/', function(req,res) {
	Promise.all([
		gamedig.fetchServer(27910),
		gamedig.fetchServer(27911),
		gamedig.fetchServer(27912),
		gamedig.fetchServer(27913)
	]).then(function(data) {
		res.end(JSON.stringify(data));
	});
});

app.get('/socketio', function(req,res) {
	io.on('connection', function() {

	})
});

console.log('Gamedig running at port 2000');