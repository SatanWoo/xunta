var express = require('express'),
    router  = express.Router();

var User    = require('../models/user.js');
var check   = require('../helper/validate').checkUserLogined;

router.post('/', check);
router.post('/', function (req, res){
	var token = req.headers['token'];
	User.logout(token, function (err) {
		if (err) res.send({'error':err});
		else res.send({'success':'登出成功'});
	});
});

module.exports = router;