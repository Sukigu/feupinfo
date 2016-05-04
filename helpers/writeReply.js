var request = require('request'),
	cheerio = require('cheerio'),
	striptags = require('striptags');

var getFood = function() {
	request('https://sigarra.up.pt/sasup/pt/web_base.gera_pagina?P_pagina=265689', function(error, response, html) {
		if (error || response.statusCode != 200) {
			return 'No food for you today.';
		}
		
		var $ = cheerio.load(html);
		
		return $('#cn-eng').children('p').first();
	});
}

module.exports = function(message) {
	return striptags(getFood());
}
