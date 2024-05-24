'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = require("../data/incubator.json").map((el) => {
      delete el.id;
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });
    await queryInterface.bulkInsert("Incubators", data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Incubators', null, {});
  }
};
