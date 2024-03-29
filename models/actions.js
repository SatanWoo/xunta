var express = require('express'),
    router  = express.Router();

var save    = require('../helper/util.js').saveModelToDatabase,
    find    = require('../helper/util.js').findModelByID,
    remove  = require('../helper/util.js').removeModelByID,
    all     = require('../helper/util.js').getListByPage;

var cache   = require('./loginCache.js');

function Action(content, authorName, authorID, longtitude, latitude) {
	this.content = content;
	this.authorName = authorName;
	this.authorID = authorID;
	this.longtitude = longtitude;
	this.latitude = latitude;
	this.date = new Date();
}

Action.list = function(page, callback) {
	all(page, 'nactions', function (err, actions) {
		if (err) {
			return callback('服务器开小差');
		}

		return callback(null, actions);
	});
}

Action.create = function(content, authorName, authorID, longtitude, latitude, callback) {
	var newAction = new Action(content, authorName, authorID, longtitude, latitude);
	save(newAction, 'nactions', function (err, action){
		if (err) {
			return callback('服务器开小差');
		}

		return callback(null, action);
	});
}

Action.detail = function(actionID, callback) {
	find(actionID, 'nactions', function (err, action) {
		if (err) {
			return callback('服务器开小差');
		}

		if (!action) {
			return callback('该动态已被删除');
		}

		return callback(null, action);
	});
}

Action.remove = function(actionID, callback) {
	remove(actionID, 'nactions', function (err) {
		if (err) {
			return callback(err);
		}

		return callback(null);
	});
}

module.exports = Action;

