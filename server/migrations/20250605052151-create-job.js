"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Jobs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      jobtitle: {
        type: Sequelize.STRING,
      },
      company: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.STRING,
      },
      jobtype: {
        type: Sequelize.STRING,
      },
      salary: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Jobs");
  },
};