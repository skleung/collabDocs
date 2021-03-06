var http = require('http'),
    express = require('express'),
    app = express(),
    nconf = require('nconf');

var server = http.createServer(app),
    io = require('socket.io').listen(server);

nconf.argv().env().file({ file: 'local.json' });

// eventually use MongoDB
var doc = { content: '' }; // for now maintain one doc for everyone
var revs = []; // revisions

require('./settings.js')(app, express, nconf);
require('./routes.js')(app, nconf);
require('./lib/socket.io-server.js')(io, doc, revs);

server.listen(process.env.PORT || nconf.get('port'));
console.log("Listening at 127.0.0.1:" + nconf.get('port'));
