'use strict';
var request = require('request'),
	cheerio = require('cheerio'),
	iconv = require('iconv-lite');

var getFood = function(datetime, callback) {
	var date = datetime.substring(0, 10),
		dateParts = date.split('-'),
		date = dateParts[2] + '.' + dateParts[1] + '.' + dateParts[0];
	
	request.get({
		url: 'https://sigarra.up.pt/sasup/pt/web_base.gera_pagina?P_pagina=265689',
		encoding: null
	}, function(error, response, body) {
		if (error || response.statusCode != 200) {
			return callback('Erro ao procurar a ementa.');
		}
		
		var $ = cheerio.load(iconv.decode(new Buffer(body), 'iso-8859-1'));
		
		var currentElement = $('#cn-eng').children().first().next(); // First day of the week under "Cantina de Engenharia"
			
		while (currentElement.length != 0) {
			if (currentElement.children('.date').text().trim() == date) { 
				return callback(currentElement.next().text().trim());
			}
			
			currentElement = currentElement.next().next(); // Next day of the week
		}
		
		return callback('Desculpa, mas não consegui encontrar informações para esse dia!');
	});
}

module.exports = function(message, reply) {
	getFood(message, function(food) {
		reply(food);
	});
}
