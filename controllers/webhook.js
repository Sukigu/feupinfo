var express = require('express'),
	router = express.Router(),
	getReply = require('../helpers/getReply'),
	sendFbMessage = require('../helpers/sendFbMessage'),
	Wit = require('node-wit').Wit;

const firstEntityValue = (entities, entity) => {
	const val = entities && entities[entity] &&
		Array.isArray(entities[entity]) &&
		entities[entity].length > 0 &&
		entities[entity][0].value
	;
	if (!val) {
		return null;
	}
	return typeof val === 'object' ? val.value : val;
};

const sessions = {};

const findOrCreateSession = (fbid) => {
	let sessionId;
	
	Object.keys(sessions).forEach(k => {
		if (sessions[k].fbid === fbid) {
			sessionId = k;
		}
	});
	
	if (!sessionId) {
		sessionId = new Date().toISOString();
		sessions[sessionId] = {
			fbid: fbid,
			context: {}
		};
	}
	
	return sessionId;
};

const actions = {
	say(sessionId, context, message, cb) {
		const recipientId = sessions[sessionId].fbid;
		
		if (recipientId) {
			fbMessage(recipientId, message, (err, data) => {
				if (err) {
					console.log('An error occurred while forwarding the response to ' + recipientId + ': ' + err);
				}
				
				cb();
			});
		} else {
			console.log('Couldn\'t find user for session: ' + sessionId);
			cb();
		}
	},
	merge(sessionId, context, entities, message, cb) {
		const datetime = firstEntityValue(entities, 'datetime');
		if (datetime) {
			context.date = datetime;
		}
		cb(context);
	},
	error(sessionId, context, error) {
		console.log(error.message);
	},
	['get-menu'](sessionId, context, cb) {
		context.menu = context.date;
		delete context.menu;
	}
};

const witBot = new Wit(process.env.WIT_TOKEN, actions);

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

			wit.runActions(
				sessionId, // the user's current session
				msg, // the user's message 
				sessions[sessionId].context, // the user's current session state
				(error, context) => {
					if (error) {
						console.log('Oops! Got an error from Wit:', error);
					} else {
						// Our bot did everything it has to do.
						// Now it's waiting for further messages to proceed.
						console.log('Waiting for futher messages.');

						// Based on the session state, you might want to reset the session.
						// This depends heavily on the business logic of your bot.
						// Example:
						// if (context['done']) {
						//   delete sessions[sessionId];
						// }

						// Updating the user's current session state
						sessions[sessionId].context = context;
					}
				}
			);
			
			getReply(text, function(reply) {
				sendFbMessage(sender, reply);
			});
		}
	}
	
	res.sendStatus(200);
});

module.exports = router;
