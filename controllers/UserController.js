const { isSame } = require("../helpers/bcrypt");
const { User, Customer } = require("../models");
const { sign } = require("../helpers/jwt");

class UserController {
  static register(req, res, next) {
    const { username, email, password } = req.body;
    const defaultData = {
      phoneNumber: 12345678,
      name: username,
      address: "1st street, 3rd block",
    };

    User.create({
      username,
      password,
      profilePicture:
        "https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652_960_720.png",
      role: "customer",
    })
      .then((user) => {
        return Customer.create({
          email,
          ...defaultData,
          UserId: user.id,
        });
      })
      .then((customer) => {
        return Customer.findOne({
          where: {
            id: customer.id,
          },
          include: {
            model: User,
            attributes: ["username", "role", "profilePicture"],
          },
        });
      })
      .then((user) => {
        const access_token = sign({
          username: user.User.username,
          role: user.User.role,
        });
        res.status(201).json({ user, access_token });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
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
            const access_token = sign({
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
            throw { status: 404, msg: "Wrong username or password" };
          }
        } else {
          throw { status: 404, msg: "Wrong username or password" };
        }
      })
      .catch((err) => {
        console.log(err);
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

  static checkExistingEmail(req, res, next) {
    const { email } = req.body;
    Customer.findOne({
      where: {
        email,
      },
    })
      .then((user) => {
        res.status(200).json({ user });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  }

  static checkExistingUsername(req, res, next) {
    const { username } = req.body;
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
