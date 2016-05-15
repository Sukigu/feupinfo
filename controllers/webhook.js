'use strict';
var express = require('express'),
	router = express.Router(),
	witBot = require('../helpers/witBot');

const bot = witBot.bot,
	sessions = witBot.sessions,
	findOrCreateSession = witBot.findOrCreateSession;

router.get('/', function(req, res) {
	if (req.query['hub.verify_token'] === process.env.WEBHOOK_VERIFY_TOKEN) {
		res.send(req.query['hub.challenge']);
	} else {
		res.send('Error, wrong validation token.');    
	}
});

router.post('/', function(req, res) {
	var messaging_events = req.body.entry[0].messaging;
	
	for (var i = 0; i < messaging_events.length; i++) {
		var event = messaging_events[i];
		var sender = event.sender.id;
		var sessionId = findOrCreateSession(sender);
		
		if (event.message) {
			var msgContents = event.message.text;
			
			if (msgContents && msgContents.charAt(0) !== '*') {
				console.log('Running actions...');

				bot.runActions(
					sessionId, // The user's current session
					msgContents, // The user's message 
					sessions[sessionId].context, // The user's current session state
					(error, context) => {
						if (error) {
							console.log('Oops! Got an error from Wit:', error);
						} else {
							// Our bot did everything it has to do
							// Now it's waiting for further messages to proceed
							console.log('Waiting for futher messages.\n');
							
							// Based on the session state, you might want to reset the session
							// This depends heavily on the business logic of your bot
							
							if (context.done) {
								delete sessions[sessionId];
							}
							else {
								// Updating the user's current session state
								sessions[sessionId].context = context;
							}
						}
					}
				);
			}
		}
	}
	
	res.sendStatus(200);
});

module.exports = router;
