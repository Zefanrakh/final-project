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
      Appointment.belongsTo(models.Customer),
      Appointment.hasMany(models.PresenceList),
      Appointment.belongsTo(modela.Price)
    }
  };
  Appointment.init({
    CustomerId: DataTypes.INTEGER,
    childName: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: {msg: 'Child name can not be empty'},
        notNull: {msg: 'Child name can not null'}
      }
    },
    childAge: {
      type: DataTypes.INTEGER,
      allowNull:false,
      validate: {
        notEmpty: {msg: 'Child age can not be empty'},
        notNull: {msg: 'Child age can not null'}
      }
    },
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    status: DataTypes.STRING,
    PriceId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    note: {
      type: DataTypes.INTEGER,
      allowNull:false,
      validate: {
        notEmpty: {msg: 'note can not be empty'},
        notNull: {msg: 'note can not null'}
      }
    },
  }, {
    sequelize,
    modelName: 'Appointment',
  });
  return Appointment;
};