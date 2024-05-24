'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Startups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      startUpName: {
        allowNull:false,
        type: Sequelize.STRING
      },
      founderName: {
        allowNull:false,
        type: Sequelize.STRING
      },
      dateFound: {
        allowNull:false,
        type: Sequelize.DATE
      },
      educationOfFounder: {
        allowNull:false,
        type: Sequelize.STRING
      },
      roleOfFounder: {
        allowNull:false,
        type: Sequelize.STRING
      },
      IncubatorId: {
        allowNull:false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: 'Incubators' },
          key:'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Startups');
  }
};