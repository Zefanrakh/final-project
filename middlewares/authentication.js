const { verify } = require("jsonwebtoken");
const { User } = require("../models");

const authentication = async (req, res, next) => {
  try {
    const access_token = req.headers.access_token;
    if (access_token) {
      const payload = verify(access_token);
      const user = await User.findOne({
        where: {
          username: payload.username,
        },
      });
      if (user) {
        req.user = user;
        next();
      } else {
        throw { status: 403, msg: "You must login first" };
      }
    } else {
      throw { status: 403, msg: "You must login first" };
    }
  } catch (err) {
    next(err);
  }
};

module.exports = authentication;
