const express = require("express");
const multer = require("multer");
const awsWorker = require('../AWS_S3/s3.controller');
const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "application/x-zip-compressed": "zip",
  "application/octet-stream": "rar"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
   console.log(file.mimetype);
    console.log(file);
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toUpperCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "." + ext);
  },
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("records"),
  awsWorker.doUpload,
  (req, res, next) => {
    //console.log(req.body);
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      label: req.body.label,
      age: req.body.age,
      gender: req.body.gender,
      scholarship: req.body.scholarship,
      ocupation: req.body.ocupation,
      age_dcl: req.body.age_dcl,
      age_dementia: req.body.age_dementia,
      content: req.body.content,
      records: url + "/images/" + req.file.filename,
      creator: req.userData.userId,
    });
    post.save().then((createdPost) => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    })
    .catch(error =>{
      res.status(500).json({
        message: "Ha ocurrido un error agregando el paciente. Verifique si el paciente ya existe"
      })
    });
  }
);

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("records"),
  (req, res, next) => {
    let records = req.body.records;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      label: req.body.label,
      age: req.body.age,
      gender: req.body.gender,
      scholarship: req.body.scholarship,
      ocupation: req.body.ocupation,
      age_dcl: req.body.age_dcl,
      age_dementia: req.body.age_dementia,
      content: req.body.content,
      records: records,
      creator: req.userData.userId,
      creator: req.userData.userId
    });
    console.log(post);
    Post.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      post
    ).then((result) => {
      if (result.nModified > 0){
        res.status(200).json({ message: "Edición realizada con éxito" });
      } else {
        res.status(401).json({ message: "No autorizado" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "No se pudo actualizar el paciente"
      })
    });
  }
);

router.get("", checkAuth, (req, res, next) => {
  console.log(req.query.searchLabel);
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  var regex = new RegExp(req.query.searchLabel, "i")
  const postQuery = Post.find({ label: regex });
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "No fue posible consultar los pacientes"
      })
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "No fue posible consultar el paciente"
    })
  });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then((result) => {
    if (result.n > 0){
      res.status(200).json({ message: "Post deleted" });
    } else {
      res.status(401).json({ message: "Not authorized" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "No fue posible consultar los pacientes"
    })
  });
});

module.exports = router;
