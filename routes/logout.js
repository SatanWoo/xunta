var express = require('express'),
    router  = express.Router();

var check   = require('../helper/validate').checkUserLogined;

router.post('/', check);
router.post('/', function (req, res){
	req.session.user = null;
	res.send({'success':'登出成功'});
});

module.exports = router;