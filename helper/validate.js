module.exports = {
	checkUserLogined: function(req, res, next) {
		if (req.session.user) {
			next();
		} else {
			res.send({'error':'您还未登录'})
		} 
	},

	checkUserNotLogin: function(req, res, next) {
		if (!req.session.user) {
			next();
		} else {
			res.send({'error':'请勿重复登录'});
		}
	}
};