'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      senderId: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        oneDelete: "CASCADE",
        oneUpdate: "CASCADE",
        allowNull: false,
      },
      receiverId: {
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
    return queryInterface.dropTable('messages');
  }
};