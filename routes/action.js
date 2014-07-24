var express = require('express'),
    router  = express.Router();
var check   = require('../helper/validate').checkUserLogined;
var Action  = require('../models/actions');
var find    = require('../helper/util').findModelByID;

router.get('/', function (req, res) {
	var page = req.query['page'] || 1;
	Action.list(page, function (err, actions) {
		if (err) {
			res.send({'error':err.toString()});
		} else {
			res.send(actions);
		}
	});
});
router.get('/:page', function (req, res) {
	var page = req.params['page'] || 1;

	Action.list(page, function (err, actions) {
		if (err) {
			res.send({'error':err.toString()});
		} else {
			res.send(actions);
		}
	});
});

router.post('/create', check);
router.post('/create', function (req, res) {
	var content = req.body['content'],
	    userID  = req.session.user._id,
	    username = req.session.user.username;

	Action.create(content, username, userID, function (err, action) {
		if (err) {
			res.send({'error':error.toString()});
		} else {
			res.send(action);
		}
	});
});

//router.get('/detail/:id', check);
router.get('/detail', function (req, res) {
	var actionID = req.query['id'];
	Action.detail(actionID, function (err, action){
		if (err) {
			res.send({'error':err.toString()});
		} else {
			res.send(action);
		}
	});
});
router.get('/detail/:id', function (req, res) {
	var actionID = req.params['id'];
	Action.detail(actionID, function (err, action){
		if (err) {
			res.send({'error':err.toString()});
		} else {
			res.send(action);
		}
	});
});

router.post('/delete/:id', check);
router.post('/delete/:id', function (req, res) {
	var actionID = req.params['id'],
	    userID   = req.session.user._id;
	find(actionID, 'actions', function (err, action){
		if (err) {
			res.send({'error':err.toString()})
		} else if (!action) {
			res.send({'error':'该动态已不存在'});
		} else if (action.authorID != userID) {
			res.send({'error':'权限不匹配，无法删除'});
		} else {
			Action.remove(actionID, function (err) {
				if (err) {
					res.send({'error':error.toString()});
				} else {
					res.send({'success':'删除成功'});
				}
			});
		}
	});
});

module.exports = router;