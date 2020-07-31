const s3 = require('../AWS_S3/s3.config');
const env = require('../AWS_S3/s3.env');
let fs = require('fs');

exports.doUpload = (req, res, next) => {
  //console.log("Estoy aca "+ req.body.label);
  //console.log(req.file);
  var newfile = req.file.path;

  fs.readFile(newfile, (err, data) => {
    if(err) {
      console.log('error: ', err);
    } else {
      //console.log(data);
      const params = {
        Bucket: env.Bucket,
        Key: req.file.filename,
        Body: data
      }
      //console.log(params);

      s3.upload(params, (err, data) => {
        //console.log("Estoy acá");
        if (err) {
          res.status(500).send("Upload error -> " + err);
        }
        fs.unlinkSync(newfile);
      });
    }
  });
  next();
}

exports.doUploadSingle = (req, res) => {
	const params = {
		Bucket: env.Bucket,
		Key: req.file.originalname,
		Body: req.file.buffer
	}

	s3.upload(params, (err, data) => {
		if (err) {
			res.status(500).send("Error -> " + err);
		}
		res.send("File uploaded successfully! -> keyname = " + req.file.originalname);
	});
}

exports.listKeyNames = (req, res) => {
  let params={};
  //console.log(req.params.label);
  if (req.params.label == 'All'){
     params = {
      Bucket: env.Bucket,
      //Prefix: req.params.label
    }
  }else{
	 params = {
		Bucket: env.Bucket,
		Prefix: req.params.label
	}
}
	var keys = [];
	s3.listObjectsV2(params, (err, data) => {
        if (err) {
			console.log(err, err.stack); // an error occurred
			res.send("error -> "+ err);
        } else {
            var contents = data.Contents;
            contents.forEach(function (content) {
                keys.push(content.Key);
      });
			res.send(keys);
		}
	});
}

exports.doDownload = (req, res) => {
	const params = {
		Bucket: env.Bucket,
		Key: req.params.filename
	}

	res.setHeader('Content-Disposition', 'attachment');

	s3.getObject(params)
		.createReadStream()
			.on('error', function(err){
				res.status(500).json({error:"Error -> " + err});
		}).pipe(res);
}
