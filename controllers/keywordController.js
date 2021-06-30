const { Appointment, Customer, PresenceList } = require("../models");
const { Op } = require("sequelize");

class Controller {
  static async searchByKeyword(req, res, next) {
    try {
      const searchType = req.query.searchType;
      const keyword = req.query.keyword;
      let result;
      if (searchType === "appointment") {
        result = await Appointment.findAll({
          where: {
            [Op.or]: {
              childName: {
                [Op.substring]: keyword,
              },
              status: { [Op.substring]: keyword },
            },
          },
        });
      } else if (searchType === "customers") {
        result = await Customer.findAll({
          where: {
            [Op.or]: {
              name: {
                [Op.substring]: keyword,
              },
              address: { [Op.substring]: keyword },
              email: { [Op.substring]: keyword },
            },
          },
        });
      } else if (searchType === "present-list") {
        result = await PresenceList.findAll({
          where: {
            [Op.or]: {
              dropperName: {
                [Op.substring]: keyword,
              },
              pickupperName: { [Op.substring]: keyword },
            },
          },
        });
      }
      res.status(200).json({ result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
