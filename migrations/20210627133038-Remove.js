'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn('Appointments', 'total')
    await queryInterface.removeColumn('Appointments', 'quantity')
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.addColumn('Appointments', 'total', Sequelize.INTEGER)
    await queryInterface.addColumn('Appointments', 'quantity', Sequelize.INTEGER)
  }
};
