'use strict';
module.exports = (sequelize, DataTypes) => {
  const mensaje = sequelize.define('mensaje', {
    id_remitente: DataTypes.INTEGER,
    id_receptor: DataTypes.INTEGER,
    contenido: DataTypes.STRING,
    fecha: DataTypes.DATE
  }, {});
  mensaje.associate = function(models) {
    // associations can be defined here
  };
  return mensaje;
};