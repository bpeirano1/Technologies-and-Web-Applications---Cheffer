'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('publicacions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_usuario: {
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING
      },
      fotos_receta: {
        type: Sequelize.STRING
      },
      ingredientes: {
        type: Sequelize.STRING
      },
      pasos: {
        type: Sequelize.STRING
      },
      video: {
        type: Sequelize.STRING
      },
      tiempo: {
        type: Sequelize.INTEGER
      },
      fotos_pasos: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('publicacions');
  }
};