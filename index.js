
var express = require('express');
var logger = require('winston');
var PSNjs = require('PSNjs');

var app = express(),
    psn;

app.set('port', (process.env.PORT || 5000));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "http://localhost:9000");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/status', function (req, res) {
    if (req.query.username && req.query.system) {
        res.json({ status: true, username: req.query.username, system: req.query.system });
    } else {
        res.status(400).json({ error: 'Username or system type not provided' });
    }
});

app.post('/signin', function(req, res) {
  psn = new PSNjs({
      // PSN email and password
      email: req.param.email,
      password: req.param.password,
      // debug printing
      debug: true,
      // optionally store session tokens in a file to speed up future connection
      authfile: ".psnAuth"
  });

  res.end();
});

app.get('/friends', function(req, res) {
  psn.getFriends(function(err, data) {
    if (!err) {
      res.json(data);
    }
  });
});

app.listen(app.get('port'), function () {
    logger.info('Destiny Status server running on port %d', app.get('port'));
});

