'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     */
   await queryInterface.bulkInsert('Prices', [{
     category: "toddler",
     package: "daily",
     price: 200000,
     createdAt: new Date(),
     updatedAt: new Date()
   },{
    category: "toddler",
    package: "weekly",
    price: 1300000,
    createdAt: new Date(),
    updatedAt: new Date()
  },{
    category: "toddler",
    package: "monthly",
    price: 6000000,
    createdAt: new Date(),
    updatedAt: new Date()
  },{
    category: "infant",
    package: "daily",
    price: 200000,
    createdAt: new Date(),
    updatedAt: new Date()
  },{
    category: "infant",
    package: "weekly",
    price: 200000,
    createdAt: new Date(),
    updatedAt: new Date()
  },{
    category: "infant",
    package: "monthly",
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
