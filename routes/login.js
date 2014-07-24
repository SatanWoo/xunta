var express = require('express'),
    router  = express.Router();

var User = require('../models/user.js');

router.post('/', function (req, res){
	var username = req.body['name'],
	    password = req.body['password'];

	User.login(username, password, function (err, user) {
		if (err) {
			req.session.user = user;
			res.send({'error':err, 'user':user});
		} else {
			req.session.user = user;
			res.send(user);
		}
	});
});

module.exports = router;