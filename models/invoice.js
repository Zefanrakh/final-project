'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Invoice.hasOne(models.PaymentDetail)
    }
  };
  Invoice.init({
    amount: DataTypes.INTEGER,
    description: DataTypes.STRING,
    expiryDate: DataTypes.DATE,
    invoiceUrl: DataTypes.STRING,
    externalID: DataTypes.STRING,
    status: DataTypes.STRING,
    paymentMethod: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Invoice',
  });
  return Invoice;
};