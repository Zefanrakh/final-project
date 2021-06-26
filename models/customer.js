"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Customer.belongsTo(models.User)
      Customer.hasMany(models.Appointment)
    }
<<<<<<< HEAD
  }
  Customer.init(
    {
      name: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
      profilePicture: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Customer",
    }
  );
=======
  };
  Customer.init({
    name: {type:DataTypes.STRING,
    validate:{
      notEmpty:{
        msg:"Name Cannot Be Empty"
      }
    }},
    address: {type:DataTypes.STRING,
    validate:{
      notEmpty:{
        msg:"Address Cannot Be Empty"
      }
    }},
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
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Customer',
  });
>>>>>>> 9d5eab71753dc37cf6abbbc6373a2ceb63682e22
  return Customer;
};
