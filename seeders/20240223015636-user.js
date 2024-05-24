'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('Users', [
      {
        email: 'robby123@gmail.com',
        password: '123Robby',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'robby321@gmail.com',
        password: '321Robby',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
