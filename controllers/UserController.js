const { isSame } = require("../helpers/bcrypt");
const { User, Customer } = require("../models");
const { sign } = require("../helpers/jwt");

class UserController {
  static register(req, res, next) {
    const {
      name,
      username,
      email,
      password,
      profilePicture,
      address,
      phoneNumber,
    } = req.body;

    User.create({
      username,
      password,
      profilePicture,
      role: "customer",
    })
      .then((user) => {
        return Customer.create({
          name,
          email,
          phoneNumber,
          address,
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
            attributes: ["id", "username", "role", "profilePicture"],
          },
        });
      })
      .then((user) => {
        const access_token = sign({
          username: user.User.username,
          role: user.User.role,
        });
        const payload = {
          username: user.username,
          profilePicture: user.profilePicture,
          role: user.role,
          CustomerId: user.Customer.id
        }
        res.status(201).json({ user: payload, access_token });
      })
      .catch((err) => {
        next(err);
      });
  }

  static login(req, res, next) {
    const { username, password, role } = req.body;

    User.findOne({
      where: {
        username,
      }, include: {model: Customer}
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
                CustomerId: user.Customer.id
              },
            });
          } else {
            next({ status: 404, message: "Wrong username or password" });
          }
        } else {
          next({ status: 404, message: "Wrong username or password" });
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
      }, include: {model: Customer}
    })
      .then((user) => {
        const payload = {
          username: user.username,
          profilePicture: user.profilePicture,
          role: user.role,
          CustomerId: user.Customer.id
        }
        res.status(200).json({user: payload});
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
