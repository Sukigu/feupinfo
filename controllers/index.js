var express = require('express'),
	router = express.Router();

router.use('/webhook', require('./webhook'));

router.get('/', function(req, res) {
	res.send('You found FEUPInfo\'s backend!');
});

module.exports = router;
