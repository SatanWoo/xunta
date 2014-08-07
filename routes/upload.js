var express = require('express'),
    router  = express.Router();

var fs = require('fs');

var multiparty = require('multiparty'),
    util       = require('util');

//var check      = require('../models/loginCache.js').check;

router.post('/', function (req, res) {
	var form = new multiparty.Form();

	form.on('part', function (part) {
		console.log('part name ' + part.name + part.filename);

		var out = fs.createWriteStream('/tmp/' + part.filename);
		part.pipe(out);
	});

	form.on('close', function () {
		res.send('finish upload');
	});

	form.parse(req);

	res.send('File uploaded successfully');

	// form.parse(req, function (err, fields, files) {
	// 	if (err) {
	// 		return res.send({'error':err.toString()});
	// 	}

	// 	req.on('part', )

	// 	res.send(files);
	// });
});

module.exports = router;