"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Blogs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      company: {
        type: Sequelize.STRING,
      },
      review: {
        type: Sequelize.TEXT,
      },
      rating: {
        type: Sequelize.INTEGER,
      },
      salary: {
        type: Sequelize.STRING,
      },
      rounds: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      role: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Blogs");
  },
};