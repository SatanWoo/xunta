var mongodb = require('mongodb').Db;
var setting = require('../settings.js');

function User(name, email, password) {
	this.username = name;
	this.email = email;
	this.password = password;
}

User.login = function (username, password, callback) {
	findUserByUsername(username, function (err, user){
		if (err) {
			return callback('服务器开小差');
		}

		if (!user || (user && user.password != password)) {
			return callback('用户不存在或者密码错误');
		}

		return callback(null, user);
	});
}

User.register = function (username, password, email, callback) {
	findUserByUsername(username, function (err, user) {
		if (err) {
			return callback('服务器开小差');
		}

		if (user) {
			return callback('用户名已存在');
		}

		findUserByEmail(email, function (err, user) {
			if (err) {
				return callback('服务器开小差');
			}

			if (user) {
				return callback('邮箱已被注册');
			}

			var newUser = new User(username, email, password);
			saveUserToDatabase(newUser, function (err, user) {
				if (err) {
					return callback('服务器开小差');
				}

				return callback(null, user);
			});
		});
	});
}

module.exports = User;

function findUserByUsername(username, callback) {
	checkUser({username:username}, callback);
}

function findUserByEmail(email, callback) {
	checkUser({email:email}, callback);
}

function checkUser(query, callback) {
	mongodb.connect(setting.url, function(err, db) {
		if (err) {
			//mongodb.close();
			return callback(err);
		}

		db.collection('users', function(err, collections) {
			if (err) {
				db.close();
				return callback(err);
			}

			collections.findOne(query, function (err, user){
				db.close();
				if (err) {
					return callback(err);
				}

				return callback(null, user);
			});
		});
	});
}

function saveUserToDatabase(user, callback) {
	mongodb.connect(setting.url, function (err, db) {
		if (err) {
			//mongodb.close();
			return callback(err);
		}

		db.collection('users', function (err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}

			collection.insert(user, {safe:true}, function (err, user) {
				db.close();
				if (err) {
					return callback(err);
				}

				return callback(null, user);
			});
		});
	});
}