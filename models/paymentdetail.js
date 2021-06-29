'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaymentDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PaymentDetail.belongsTo(models.Invoice)
      PaymentDetail.belongsTo(models.Appointment)
    }
  };
  PaymentDetail.init({
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    AppointmentId: DataTypes.INTEGER,
    InvoiceId: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PaymentDetail',
  });
  return PaymentDetail;
};