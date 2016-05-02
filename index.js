var app = require('express')();

app.get('/', function (req, res) {
  if (req.query['hub.verify_token'] === 't0Iv74RLdyS0pHpGDaI27Kf4Dv213w8d') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');    
  }
});

app.listen(80, function () {
  console.log('Example app listening on port 80!');
});
