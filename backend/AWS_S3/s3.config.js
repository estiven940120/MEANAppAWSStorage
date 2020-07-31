const AWS = require('aws-sdk');
const env = require('./s3.env');

const s3 = new AWS.S3({
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
	  region : env.REGION
});


module.exports = s3;
