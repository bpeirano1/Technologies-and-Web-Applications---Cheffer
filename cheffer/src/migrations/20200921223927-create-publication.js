'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('publications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      recipesPictures: {
        type: Sequelize.STRING
      },
      ingredients: {
        type: Sequelize.STRING
      },
      recipesVideos: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.FLOAT
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        oneDelete: "CASCADE",
        oneUpdate: "CASCADE",
        allowNull: false,
      },
      steps: {
        type: Sequelize.STRING
      },
      ranking: {
        type: Sequelize.FLOAT
      },
      stepsPictures: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('publications');
  }
};