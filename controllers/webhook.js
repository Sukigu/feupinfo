var express = require('express'),
	router = express.Router(),
	writeReply = require('../helpers/writeReply'),
	sendFbMessage = require('../helpers/sendFbMessage');	

router.get('/', function(req, res) {
	if (req.query['hub.verify_token'] === process.env.WEBHOOK_VERIFY_TOKEN) {
		res.send(req.query['hub.challenge']);
	} else {
		res.send('Error, wrong validation token.');    
	}
});

router.post('/', function(req, res) {
	messaging_events = req.body.entry[0].messaging;
	
	for (i = 0; i < messaging_events.length; i++) {
		event = req.body.entry[0].messaging[i];
		sender = event.sender.id;
		
		if (event.message && event.message.text) {
			text = event.message.text;
			reply = writeReply(text);
			sendFbMessage(sender, reply);
		}
	}
	
	res.sendStatus(200);
});

module.exports = router;
