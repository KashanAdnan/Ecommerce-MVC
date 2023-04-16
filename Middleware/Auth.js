const jwt = require("jsonwebtoken");
const config = require("../Config/config");

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];
  if (!token) {
    res.status(400).send({
      succes: false,
      msg: "Token is required for Authentication",
    });
  }
  try {
    const decode = jwt.verify(token, config.secret_jwt);
    req.user = decode;
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
  return next();
};

module.exports = {
  verifyToken,
};
