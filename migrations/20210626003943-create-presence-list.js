'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PresenceLists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dropperName: {
        type: Sequelize.STRING
      },
      pickupperName: {
        type: Sequelize.STRING
      },
      pickupTime: {
        type: Sequelize.TIME
      },
      presenceDate: {
        type: Sequelize.DATEONLY
      },
      AppointmentId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PresenceLists');
  }
};