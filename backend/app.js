const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const env = require("./back_env");
const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const filesRoutes = require("./routes/files");

const app = express();

mongoose
  .connect(
    "mongodb+srv://test:" + env.MONGO_ATLAS_PASSWORD + "@pruebanode-wiyzn.gcp.mongodb.net/node-angular?authSource=admin&replicaSet=PruebaNode-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass%20Community&retryWrites=true&ssl=true"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/files", filesRoutes);



module.exports = app;
