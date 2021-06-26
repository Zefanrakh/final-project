"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Customer)
    }
<<<<<<< HEAD
  }
  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      CustomerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
=======
  };
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    profilePicture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
>>>>>>> 9d5eab71753dc37cf6abbbc6373a2ceb63682e22
  return User;
};
