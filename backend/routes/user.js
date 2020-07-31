const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("../back_env");
const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  var email = req.body.email.toLowerCase();
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: email,
      password: hash,
      role: "Visitor"
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created!",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "El correo ya se encuentra registrado"
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let email = req.body.email.toLowerCase();
  let fetchedUser;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Credenciales incorrectas",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Credenciales incorrectas"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch((err) => {

      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    });
});

module.exports = router;
