'use strict';
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser');

var port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(require('./controllers'));

app.listen(port, function () {
	console.log('Now listening on port ' + port + '...');
});
