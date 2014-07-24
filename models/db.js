var DB = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;

var settings = require('../settings.js');

module.exports = new DB(settings.db, new Server(settings.host, Connection.DEFAULT_PORT), {safe:true});