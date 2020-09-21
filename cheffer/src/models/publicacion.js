'use strict';
module.exports = (sequelize, DataTypes) => {
  const publicacion = sequelize.define('publicacion', {
    id_usuario: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    fotos_receta: DataTypes.STRING,
    ingredientes: DataTypes.STRING,
    pasos: DataTypes.STRING,
    video: DataTypes.STRING,
    tiempo: DataTypes.INTEGER,
    fotos_pasos: DataTypes.STRING
  }, {});
  publicacion.associate = function(models) {
    // associations can be defined here
  };
  return publicacion;
};