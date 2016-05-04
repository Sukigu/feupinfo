var request = require('request'),
	cheerio = require('cheerio'),
	iconv = require('iconv-lite');

var getFood = function(callback) {
	request.get({
		url: 'https://sigarra.up.pt/sasup/pt/web_base.gera_pagina?P_pagina=265689'/*,
		encoding: null*/
	}, function(error, response, body) {
		if (error || response.statusCode != 200) {
			return 'No food for you today.';
		}
		
		var $ = cheerio.load(/*iconv.decode(new Buffer(body), 'iso-8859-1')*/ body);
		
		var food = $('#cn-eng').children('p').first().text();
		
		console.log(food);
		
		callback(food);
	});
}

module.exports = function(message, reply) {
	getFood(function(food) {
		reply(food);
	});
}
