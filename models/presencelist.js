"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PresenceList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PresenceList.belongsTo(models.Appointment);
    }
  }
  PresenceList.init(
    {
      dropperName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Dropper name can not be empty" },
          notNull: { msg: "Dropper name can not null" },
        },
      },
      pickuperName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Pickuper name can not be empty" },
          notNull: { msg: "Pickuper name can not null" },
        },
      },
      pickupTime: DataTypes.TIME,
      presenceDate: DataTypes.DATEONLY,
      AppointmentId: DataTypes.INTEGER,

      pickupperName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Pickuper name can not be empty' },
          notNull: { msg: 'Pickuper name can not null' }
        }
      },
      pickupTime: DataTypes.TIME,
      presenceDate: DataTypes.DATEONLY,
      AppointmentId: DataTypes.INTEGER
    }, {
    sequelize,
    modelName: 'PresenceList',
  });

  return PresenceList;
};
