"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("Appointments", [
      {
        childName: "barack zein",
        childAge: 9,
        startDate: new Date(29, 2, 2021),
        endDate: new Date(31, 2, 2021),
        note: "notes panjang banget sampe gabisa diliat",
        status: "belum bayar",
        PriceId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        childName: "kevin",
        childAge: 10,
        startDate: new Date(29, 2, 2021),
        endDate: new Date(31, 2, 2021),
        note: "notes panjang banget sampe gabisa diliat",
        status: "sudah bayar",
        PriceId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Appointments");
  },
};
