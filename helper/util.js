var mongodb = require('../models/db');
var ObjectID = require('mongodb').ObjectID;

module.exports = {
	saveModelToDatabase: function (model, collectionName, callback) {
		mongodb.open(function (err, db) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			db.collection(collectionName, function (err, collection) {
				if (err) {
					mongodb.close();
					return callback(err);
				}

				collection.insert(model, {safe:true}, function (err, model) {
					mongodb.close();
					if (err) {
						return callback(err);
					}

					return callback(null, model);
				});
			});
		});
	},

	removeModelByID: function (modelID, collectionName, callback) {
		mongodb.open(function (err, db) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			db.collection(collectionName, function (err, collection) {
				collection.remove({_id:new ObjectID(modelID)}, {w:1}, function (err) {
					mongodb.close();
					if (err) {
						return callback(err);
					}

					return callback(null);
				});
			});
		});
	},

	findModelByID: function(modelID, collectionName, callback) {
		mongodb.open(function (err, db) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			db.collection(collectionName, function (err, collection) {
				collection.findOne({_id:new ObjectID(modelID)}, function (err, model) {
					mongodb.close();
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
		mongodb.open(function (err, db) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			db.collection(collectionName, function (err, collection) {
				if (err) {
					mongodb.close();
					return callback(err);
				}

				collection.find({}, {skip:(page - 1) * pageCount, limit:pageCount}).sort({date:-1}).toArray(function (err, models) {
					mongodb.close();
					if (err) {
						return callback(err);
					}

					return callback(null, models);
				});
			});
		});
	}
};