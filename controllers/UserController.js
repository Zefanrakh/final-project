const { Customer } = require("../models");

class UserController {
  static register(req, res, next) {
    const { name, picture, email, phoneNumber, address } = req.user;
    Customer.create({
      name,
      email,
      picture,
      phoneNumber,
      address,
    })
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        next(err);
      });
  }

  static login(req, res, next) {
    const { name, picture, email, phoneNumber, address } = req.user;
    Customer.findOne({
      where: {
        email,
      },
    })
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = UserController;
