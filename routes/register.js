var express = require('express');
var router = express.Router();
var User = require('../models/user.js');

router.post('/', function(req, res) {
	var username = req.body['name'],
	    email   = req.body['email'];
	    password = req.body['password'];

	User.register(username, password, email, function (err, user) {
		if (err) {
			res.send({'error': err.toString()});
		} else {
			//req.session.user = user;
			res.send(user);
		}
	});
});

 module.exports = router;