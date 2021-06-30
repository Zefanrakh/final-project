const { verify } = require("../helpers/jwt");
const { User } = require("../models");
const callbackToken = process.env.CALLBACK_TOKEN

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
        next({ status: 403, message: "You must login first" })
      }
    } else {
      next({ status: 403, message: "You must login first" });
    }
  } catch (err) {
    next(err);
  }
};

// const callbackTokenAuth = async (req, res, next) => {
//   const headers = req.headers
//   try {
//     !headers && next({ status: 401, message: 'Unauthorized Access' })
//     const token = Object.values(headers)[3]
//     const matchedToken = callbackToken === token
//     !matchedToken && next({ status: 403, message: "Invalid signature. You don't have permission to access this page" })
//     next()
//   } catch (error) {
//     next(error)
//   }
// }

module.exports = authentication
