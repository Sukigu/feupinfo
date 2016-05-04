var express = require('express'),
	router = express.Router(),
	getReply = require('../helpers/getReply');	

router.get('/', function(req, res) {
	getReply('', function(reply) {
		res.send(reply);
	});
});

module.exports = router;
