const { isSame } = require("../helpers/bcrypt");
const { User, Customer } = require("../models");
const { generateToken } = require("../helpers/jwt");

class UserController {
  static register(req, res, next) {
    // const { name, picture, email, phoneNumber, address } = req.user;
    // User.create({
    //   username: name,
    //   password,
    //   profilePicture,
    //   role,
    // })
    //   .then((user) => {
    //     res.status(201).json(user);
    //   })
    //   .catch((err) => {
    //     next(err);
    //   });
  }

  static login(req, res, next) {
    const { username, password, role } = req.body;

    User.findOne({
      where: {
        username,
      },
    })
      .then((user) => {
        if (user) {
          const success = isSame(password, user.password);
          if (success) {
            const access_token = generateToken({
              username: user.username,
              role: user.role,
            });
            res.status(200).json({
              access_token,
              user: {
                username: user.username,
                profilePicture: user.profilePicture,
                role: user.role,
              },
            });
          } else {
            throw { status: 404, msg: "Wrong email or password" };
          }
        } else {
          throw { status: 404, msg: "Wrong email or password" };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static getCurrentUser(req, res, next) {
    const { username } = req.user;
    User.findOne({
      where: {
        username,
      },
    })
      .then((user) => {
        res.status(200).json({ user });
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = UserController;
