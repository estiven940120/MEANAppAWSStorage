const express = require("express");
const multer = require("multer");
const awsWorker = require('../AWS_S3/s3.controller');
const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");
let upload = require('../AWS_S3/multer.config');

const router = express.Router();

router.get('/show/:label', awsWorker.listKeyNames);

router.get('/:filename', awsWorker.doDownload);

router.post('/uploadSingle', upload.single("file"), awsWorker.doUploadSingle);

module.exports = router;
