const jwt = require("jsonwebtoken");
const env = require("../back_env");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, env.JWT_KEY);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId};
    next();
  } catch (error) {
    res.status(401).json({ message: "No estás autenticado" });
  }
};
