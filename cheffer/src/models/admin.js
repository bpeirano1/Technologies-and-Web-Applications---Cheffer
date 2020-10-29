'use strict';

const bcrypt = require('bcrypt');
const PASSWORD_SALT = 10; // veces que se encripta la constraseña

async function buildPasswordHash(instance) {
  if (instance.changed('password')){
    const hash = await bcrypt.hash(instance.password, PASSWORD_SALT);
    instance.set('password', hash);
  }
}

module.exports = (sequelize, DataTypes) => {
  const admin = sequelize.define('admin', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  admin.associate = function(models) {
    // associations can be defined here
  };

  admin.beforeCreate(buildPasswordHash);
  admin.beforeUpdate(buildPasswordHash);

  admin.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password)
  }
  return admin;
};