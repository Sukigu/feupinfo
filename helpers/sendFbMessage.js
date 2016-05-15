'use strict';
var request = require('request');

module.exports = function(recipientId, message, cb) {
	var messageData = {
		text: message
	};
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
		method: 'POST',
		json: {
			recipient: { id: recipientId },
			message: messageData,
		}
	}, function(error, response, body) {
		if (cb) {
			cb(error || response.body.error, body);
		}
	});
}
