'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("saved_publications", {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        reference: {
          model: "users",
          key: "id",
        }
      },
      publicationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        reference: {
          model: "publications",
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
    return queryInterface.dropTable("saved_publications");
  }
};
