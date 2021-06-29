"use strict";
const { Model } = require("sequelize");
const now = new Date().toISOString().substring(0, 10);
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Appointment.belongsTo(models.Customer)
      Appointment.hasMany(models.PresenceList)
      Appointment.hasOne(models.PaymentDetail)

    }
  }
  Appointment.init(
    {
      CustomerId: DataTypes.INTEGER,
      childName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Child name can not be empty" },
          notNull: { msg: "Child name can not null" },
        },
      },
      childAge: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Child age can not be empty" },
          notNull: { msg: "Child age can not null" },
          min: { args: [0], msg: "Age must be filed with number 0 to 4" },
          max: { args: [4], msg: "Age must be filed with number 0 to 4" },
        },
      },
      startDate: {
        allowNull: false,
        type: DataTypes.DATEONLY,
        validate: {
          notEmpty: { msg: "startDate can not be empty" },
          notNull: { msg: "startDate can not null" },
          isDate: { msg: "start date format must be date" },
          isAfter: {
            args: [now],
            msg: "start date mus be equal or greater than today",
          },
        },
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notEmpty: { msg: "End Date can not be empty" },
          notNull: { msg: "End Date can not null" },
          isDate: { msg: "End Date format must be date" },
          isAfter: {
            args: [now],
            msg: "End date mus be equal or greater than today",
          },
        },
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
        notIn: {
          args: ["sudah bayar", "belum bayar", "cancle"],
          msg: "status must be sudah bayar or belum bayar or cancel",
        },
      },
      note: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "note can not be empty" },
          notNull: { msg: "note can not null" },
        },
      },
    },

    {
      sequelize,
      modelName: "Appointment",
    }
  );
  return Appointment;
};
