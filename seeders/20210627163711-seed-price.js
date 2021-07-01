'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     */
   await queryInterface.bulkInsert('Prices', [{
     category: "Toddler",
     package: "Daily",
     price: 200000,
     createdAt: new Date(),
     updatedAt: new Date()
   },{
    category: "Toddler",
    package: "Weekly",
    price: 1300000,
    createdAt: new Date(),
    updatedAt: new Date()
  },{
    category: "Toddler",
    package: "Monthly",
    price: 6000000,
    createdAt: new Date(),
    updatedAt: new Date()
  },{
    category: "Infant",
    package: "Daily",
    price: 200000,
    createdAt: new Date(),
    updatedAt: new Date()
  },{
    category: "Infant",
    package: "Weekly",
    price: 200000,
    createdAt: new Date(),
    updatedAt: new Date()
  },{
    category: "Infant",
    package: "Monthly",
    price: 200000,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
    await queryInterface.bulkDelete('Prices', null, {});
  }
};
