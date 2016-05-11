'use strict';
var Wit = require('node-wit').Wit,
	getReply = require('./getReply'),
	sendFbMessage = require('./sendFbMessage');

const firstEntityValue = (entities, entity) => {
	const val = entities && entities[entity] &&
		Array.isArray(entities[entity]) &&
		entities[entity].length > 0 &&
		entities[entity][0].value;
	if (!val) {
		return null;
	}
	return typeof val === 'object' ? val.value : val;
};

// This will contain all user sessions.
// Each session has an entry:
// sessionId -> {fbid: facebookUserId, context: sessionState}
const sessions = {};

const findOrCreateSession = (fbid) => {
	let sessionId;
	
	// Let's see if we already have a session for the user fbid
	Object.keys(sessions).forEach(k => {
		if (sessions[k].fbid === fbid) {
			// Yep, got it!
			sessionId = k;
		}
	});
	
	if (!sessionId) {
		// No session found for user fbid, let's create a new one
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
		// Our bot has something to say!
		// Let's retrieve the Facebook user whose session belongs to
		const recipientId = sessions[sessionId].fbid;
		
		if (recipientId) {
			// Yay, we found our recipient!
			// Let's forward our bot's response to them
			sendFbMessage(recipientId, message, (err, data) => {
				if (err) {
					console.log('An error occurred while forwarding the response to', recipientId, ':', err);
				}
				
				// Let's give the wheel back to our bot
				cb();
			});
		} else {
			console.log('Couldn\'t find user for session:', sessionId);
			// Giving the wheel back to our bot
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
		getReply(context.date, function(menu) {
			context.menu = menu;
			delete context.date;
			cb(context);
		});
	}
};

const bot = new Wit(process.env.WIT_TOKEN, actions);

module.exports = {
	findOrCreateSession: findOrCreateSession,
	sessions: sessions,
	bot: bot
};
