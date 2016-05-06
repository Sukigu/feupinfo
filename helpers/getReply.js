var request = require('request'),
	cheerio = require('cheerio'),
	iconv = require('iconv-lite');

var getFood = function(date, callback) {
	request.get({
		url: 'https://sigarra.up.pt/sasup/pt/web_base.gera_pagina?P_pagina=265689',
		encoding: null
	}, function(error, response, body) {
		if (error || response.statusCode != 200) {
			return callback('Erro ao procurar a ementa.');
		}
		else {
			var $ = cheerio.load(iconv.decode(new Buffer(body), 'iso-8859-1'));
			
			var currentElement = $('#cn-eng').children().first();
			
			if (currentElement.next()) {
				currentElement = currentElement.next();
				
				do {
					if (currentElement.children('.date').text().trim() == date) {
						return callback(currentElement.next().text().trim());
					}
				} while (currentElement.next().next())
			}
		}
		
		callback('Desculpa, mas não consegui encontrar informações para esse dia!');
	});
}

module.exports = function(message, reply) {
	getFood(message, function(food) {
		reply(food);
	});
}
