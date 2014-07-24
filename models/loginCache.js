var redis = require('redis');
var poolModule = require('generic-pool');
var random = require('crypto').randomBytes;

var pool = poolModule.Pool({
	name : 'token',
	create: function(callback) {
		var client = redis.createClient();
		callback(null, client);
	},

	destroy : function(client) {
		client.quit();
	},

	max : 100,
  	min : 5,
  	idleTimeoutMillis : 60000,
  	log : true
});

function setTokenCache(userID, callback) {
	pool.acquire(function (err, client) {
		if (err) {
			return callback(err);
		}

		client.SELECT(0, function() {
			random(16, function (ex, buf) {
				var token = buf.toString('hex') + userID.toString();
				client.set(token, userID, function (err, result) {
					if (err) {
						return callback(err);
					}

					client.EXPIRE(token, 10 * 24 * 60 * 60, function () {
				        // 释放连接
				        pool.release(client);
			        });

					var re = {'token':token, 'id':userID};
			        return callback(null, re);
				});
			});
		});
	});
}

function clearTokenCache(token, callback) {
	pool.acquire(function (err, client) {
		if (err) {
			return callback(err);
		}

		client.DEL(token, function (err) {
			pool.release(client);
		});

		return callback(null);
	});
}

function validateToken(token, callback) {
	pool.acquire(function (err, client) {
		if (err) {
			return callback(err);
		}

		client.GET(token, function (err, result) {
			if (!result) {
				return callback("还未登录");
			}
			return callback(null, result);
		});
	});
}

exports.logout = clearTokenCache;
exports.login  = setTokenCache;
exports.check  = validateToken;