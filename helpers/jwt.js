const jwt = require("jsonwebtoken");
const PRIVATE_KEY = process.env.JWT_SECRET;

const sign = (obj) => {
  return jwt.sign(obj, PRIVATE_KEY);
};

const verify = (token) => {
  return jwt.verify(token, PRIVATE_KEY);
};

module.exports = {
  sign,
  verify,
};
