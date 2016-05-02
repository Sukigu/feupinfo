var express = require('express');
	app = express(),
	bodyParser = require('body-parser');

var port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	if (req.query['hub.verify_token'] === 't0Iv74RLdyS0pHpGDaI27Kf4Dv213w8d') {
		res.send(req.query['hub.challenge']);
	} else {
		res.send('Error, wrong validation token');    
	}
});

app.post('/', function(req, res) {
	console.log(req.body);
});

app.listen(port, function () {
	console.log('Now listening on port ' + port + '...');
});
