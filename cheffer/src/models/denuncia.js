'use strict';
module.exports = (sequelize, DataTypes) => {
  const denuncia = sequelize.define('denuncia', {
    id_publicacion: DataTypes.INTEGER,
    id_usuario: DataTypes.INTEGER,
    contenido: DataTypes.STRING,
    fecha: DataTypes.DATE
  }, {});
  denuncia.associate = function(models) {
    // associations can be defined here
  };
  return denuncia;
};