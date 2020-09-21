'use strict';
module.exports = (sequelize, DataTypes) => {
  const usuario = sequelize.define('usuario', {
    name: DataTypes.STRING,
    lastname: DataTypes.STRING,
    nickname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    foto: DataTypes.STRING,
    pais: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    recetas_guardadas: DataTypes.STRING,
    seguidores: DataTypes.STRING,
    usuarios_bloqueados: DataTypes.STRING
  }, {});
  usuario.associate = function(models) {
    // associations can be defined here
  };
  return usuario;
};