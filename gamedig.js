var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var gamedig = require('gamedig');
http.listen(2000);

gamedig.fetchServer = function(host, port) {
	return new Promise(function(resolve, reject) {
		gamedig.query({
			type: 'quake2',
			host: host,
			port: port
		}, function(state) {
			if(state.error) reject({'error':'gamedig error'});
			else resolve(state);
		});
	});
};

gamedig.fetchAllServers = function(_fnCallback) {
	Promise.all([
		gamedig.fetchServer('server.aq2chile.cl',27910),
		gamedig.fetchServer('server.aq2chile.cl',27911),
		gamedig.fetchServer('server.aq2chile.cl',27912),
		gamedig.fetchServer('server.aq2chile.cl',27913),
		gamedig.fetchServer('190.151.36.178',27910)
	]).then(function(data) {
		if(_fnCallback && typeof _fnCallback === 'function') {
			_fnCallback(true, data);
		}
	}, function() {
		if(_fnCallback && typeof _fnCallback === 'function') {
			_fnCallback(false);
		}
	});
};

//Static service
app.get('/', function(req,res) {
	gamedig.fetchAllServers(function(status, servers) {
		if(!status) res.end('[]');
		else res.end(JSON.stringify(servers));
	});
});

//Socket service
io.on('connection', function(socket) {
	var fetch = function() {
		gamedig.fetchAllServers(function(status, servers) {
			if(status)
				socket.emit('servers', servers);
		});
	}
	
	fetch();
	setInterval(fetch, 5000);
});

console.log('Gamedig running at port 2000');