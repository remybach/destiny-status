
var express = require('express');
var logger = require('winston');

var app = express();
var bodyParser = require('body-parser');
var PSNjs = require('PSNjs');

var activities = require('./lib/activities');

app.set('port', (process.env.PORT || 4040));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false, parameterLimit: 2 }));

var router = express.Router();

router
    .get('/', function (req, res) {
        res.render('index');
        // if logged in redirect to dashboard
    })
    .get('/dashboard', function (req, res) {
        res.render('dashboard', {});
    })
    .post('/login', function (req, res) {
        if (req.body.email && req.body.password) {
            var psn = new PSNjs({
                email: req.body.email,
                password: req.body.password,
                debug: true
            });

            psn.getFriends(0, 999, function (error, data) {
                if (error) {
                    logger.error('Unable to log into PSN');
                    res.status(500).json({error: 'Failed login'});
                } else {
                    var friends = [];

                    for (var friend in data.friendList) {
                        friends.push(data.friendList[friend].onlineId);
                    }

                    res.json({ success: true, friends: friends });
                }
            });
        }
    })
    .get('/status/:system?/:username?', function (req, res) {
        if (req.params.username && req.params.system) {
            var username = req.params.username;
            var system = req.params.system;

            // this will be replaced with a server call, hacky for now
            var playerStatus = {};

            res.render('status/view', { activities: activities, status: playerStatus });
        }
    })
    .get('/status/:system?/:username?/edit', function (req, res) {
        if (req.params.username && req.params.system) {
            var username = req.params.username;
            var system = req.params.system;

            // this will be replaced with a server call, hacky for now
            var playerStatus = {};

            res.render('status/edit', { activities: activities, status: playerStatus });
        }
    });

app.use(router);

// connect to bungie.net and get the current list of activities
// fail if there's an error, otherwise start the server
app.listen(app.get('port'), function () {
    logger.info('Destiny Status client running on port %d', app.get('port'));
});


