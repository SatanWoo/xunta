var express = require('express'),
    router  = express.Router();

var uuid    = require('node-uuid');

var fs = require('fs');

var multiparty = require('multiparty'),
    util       = require('util');

var qiniu = require('qiniu');
qiniu.conf.ACCESS_KEY = "p1LVGwStSUb145-i27hYsskBKFxXNHzxOrN71qWm";
qiniu.conf.SECRET_KEY = "dUVwbgKTiUI-uY9VmctjFSjPIBkkF0wt2DTQCSUR";

//var conn = new qiniu.rs.Client();;
var bucket = "xuntaimage";
//var rs = new qiniu.rs.Service(conn, bucket);

// 上传文件第1步
// 生成上传授权凭证（uploadToken）
var opts = {
    scope: "xuntaimage",
    expires: 3600,
};
//var token = new qiniu.auth.UploadToken(opts);
//var uploadToken = token.generateToken();

function uptoken(bucketname) {
  var putPolicy = new qiniu.rs.PutPolicy(bucketname);
  
  return putPolicy.token();
}

function uploadFile(localFile, key, uptoken) {
  var extra = new qiniu.io.PutExtra();

  qiniu.io.put(uptoken, key, localFile, extra, function(err, ret) {
    if(!err) {
      // 上传成功， 处理返回值
      console.log(ret.key, ret.hash);
      // ret.key & ret.hash
    } else {
      // 上传失败， 处理返回代码
      console.log(err);
      // http://developer.qiniu.com/docs/v6/api/reference/codes.html
    }
  });
}

//var check      = require('../models/loginCache.js').check;

router.post('/', function (req, res) {
	var form = new multiparty.Form();
	var datas = [];
	var key = uuid.v4() + ".jpg";

	form.on('part', function (part) {

		if (!part.filename) {
			part.resume();
		} else {
			part.on('data', function (data) {
				datas.push(data)
			});

			part.resume();
		}
	});

	form.on('file', function (name, file) {
	
	});

	form.on('close', function () {
		var buffer = Buffer.concat(datas);
		//console.log(buffer);
		
		uploadFile(buffer, key, uptoken(bucket));
		console.log('close');
		res.send({'key': key});
	});

	form.parse(req);

});

module.exports = router;