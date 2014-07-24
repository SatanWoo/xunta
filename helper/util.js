var mongodb = require('mongodb').Db;
var ObjectID = require('mongodb').ObjectID;
var setting  = require('../settings.js');

module.exports = {
	saveModelToDatabase: function (model, collectionName, callback) {
		mongodb.connect(setting.url, function (err, db) {
			if (err) {
				return callback(err);
			}

			db.collection(collectionName, function (err, collection) {
				if (err) {
					db.close();
					return callback(err);
				}

				collection.insert(model, {safe:true}, function (err, model) {
					db.close();
					if (err) {
						return callback(err);
					}

					return callback(null, model);
				});
			});
		});
	},

	removeModelByID: function (modelID, collectionName, callback) {
		mongodb.connect(setting.url, function (err, db) {
			if (err) {
				//mongodb.close();
				return callback(err);
			}

			db.collection(collectionName, function (err, collection) {
				collection.remove({_id:new ObjectID(modelID)}, {w:1}, function (err) {
					db.close();
					if (err) {
						return callback(err);
					}

					return callback(null);
				});
			});
		});
	},

	findModelByID: function(modelID, collectionName, callback) {
		mongodb.connect(setting.url, function (err, db) {
			if (err) {
				//mongodb.close();
				return callback(err);
			}

			db.collection(collectionName, function (err, collection) {
				if (err) {
					db.close();
					return callback(err);
				}

				collection.findOne({_id:new ObjectID(modelID)}, function (err, model) {
					db.close();
					if (err) {
						return callback(err);
					}

					return callback(null, model);
				});
			});
		});
	},

	getListByPage: function(page, collectionName, callback) {
		var pageCount = 20;
		mongodb.connect(setting.url, function (err, db) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			db.collection(collectionName, function (err, collection) {
				if (err) {
					db.close();
					return callback(err);
				}

				collection.find({}, {skip:(page - 1) * pageCount, limit:pageCount}).sort({date:-1}).toArray(function (err, models) {
					db.close();
					if (err) {
						return callback(err);
					}

					return callback(null, models);
				});
			});
		});
	}
};