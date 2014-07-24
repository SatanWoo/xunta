var cache = require('../models/loginCache.js');

module.exports = {
	checkUserLogined: function(req, res, next) {
		var token = req.headers['token'];	
		
		cache.check(token, function (err, result){
			if (err) {
				res.send({'error':'您还未登录'});
			} else {
				next();
			}
		});
	},

	checkUserNotLogin: function(req, res, next) {
		if (!req.session.user) {
			next();
		} else {
			res.send({'error':'请勿重复登录'});
		}
	}
};