'use strict';
var express = require('express'),
	router = express.Router(),
	getReply = require('../helpers/getReply');	

router.get('/:message', function(req, res) {
	getReply(req.params.message, function(reply) {
		res.send(reply);
	});
});

module.exports = router;
