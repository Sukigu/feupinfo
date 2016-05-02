var express = require('express');
var app = express();

var port = process.env.PORT || 8080;

app.get('/', function (req, res) {
  if (req.query['hub.verify_token'] === 't0Iv74RLdyS0pHpGDaI27Kf4Dv213w8d') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');    
  }
});

app.listen(port, function () {
  console.log('Now listening on port ' + port + '...');
});
