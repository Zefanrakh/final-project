'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Appointment.init({
    CustomerId: DataTypes.INTEGER,
    dropperName: DataTypes.STRING,
    pickuperName: DataTypes.STRING,
    childName: DataTypes.STRING,
    childAge: DataTypes.INTEGER,
    appointmentDate: DataTypes.DATEONLY,
    pickupTime: DataTypes.TIME,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Appointment',
  });
  return Appointment;
};