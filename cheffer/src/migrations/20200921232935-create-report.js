'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      publicationId: {
        type: Sequelize.INTEGER,
        references: {
          model: "publications",
          key: "id",
        },
        oneDelete: "CASCADE",
        oneUpdate: "CASCADE",
        allowNull: false,
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
    return queryInterface.dropTable('reports');
  }
};