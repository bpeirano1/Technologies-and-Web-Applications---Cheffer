'use strict';
module.exports = (sequelize, DataTypes) => {
  const comentario = sequelize.define('comentario', {
    descripcion: DataTypes.STRING
  }, {});
  comentario.associate = function(models) {
    // associations can be defined here
  };
  return comentario;
};