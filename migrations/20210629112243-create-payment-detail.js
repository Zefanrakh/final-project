'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PaymentDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.INTEGER
      },
      AppointmentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Appointments',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      InvoiceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Invoices',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      status: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('PaymentDetails');
  }
};