"use strict";
var express = require('express');
var app = express();

var nconf = require('nconf');
nconf.argv().env().file({ file: 'local.json' });

require('./settings')(app, express, nconf);
require('./routes')(app, nconf);
app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || nconf.get('port'));
console.log("listening on port: "+nconf.get('port'));