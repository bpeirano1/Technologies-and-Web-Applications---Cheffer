'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("user_followers", {
      userFollowsId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        reference: {
          model: "users",
          key: "id",
        }
      },
      userFollowedId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        reference: {
          model: "users",
          key: "id",
        }
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
    return queryInterface.dropTable("user_followers");
  }
};
