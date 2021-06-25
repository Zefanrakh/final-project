'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Customer.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    email: {type:DataTypes.STRING,
    validate:{
      isEmail:{
        args:true,
        msg:"Invalid E-Mail Format"
      },
      notEmpty:{
        msg:"E-mail Cannot be Empty"
      },
    },unique:true},
    phoneNumber: {type:DataTypes.STRING,
      validate:{
        isNumeric:{
          msg:"input Phone Number with Number"
        }
      }
    },
    profilePicture:{type:DataTypes.STRING,
    validate:{
      notEmpty:{
        msg:"Picture Cannot Be Empty"
      }
    }}
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};