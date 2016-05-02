var express = require('express');
	app = express(),
	bodyParser = require('body-parser'),
	request = require('request');

var port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.listen(port, function () {
	console.log('Now listening on port ' + port + '...');
});

app.get('/', function (req, res) {
	if (req.query['hub.verify_token'] === 't0Iv74RLdyS0pHpGDaI27Kf4Dv213w8d') {
		res.send(req.query['hub.challenge']);
	} else {
		res.send('Error, wrong validation token');    
	}
});

app.post('/', function(req, res) {
	messaging_events = req.body.entry[0].messaging;
	
	for (i = 0; i < messaging_events.length; i++) {
		event = req.body.entry[0].messaging[i];
		sender = event.sender.id;
		
		if (event.message && event.message.text) {
			text = event.message.text;
			sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
		}
	}
	
	res.sendStatus(200);
});

var token = 'EAAIRT12vp00BAChhCZBC5gVKjkhxZBo61TkTgeNuEVOZBc5NIdaScemw2cCO5Jq0os3iUrEY5p19nnAAU84BXP2w1ZAn2LRNALNhPMXlqXZBoKGNcZBphsLvnviIZC9Vnyarv2MVsMXtuzycTqwkDKZBxZBEvNcb3ez3PWNeiVZB17OAZDZD';

function sendTextMessage(sender, text) {
	var messageData = {
		text:text
	};
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: { access_token:token },
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending message: ', error);
		} else if (response.body.error) {
			console.log('Error: ', response.body.error);
		}
	});
}
