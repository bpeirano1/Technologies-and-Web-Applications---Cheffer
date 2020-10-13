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
  const user = sequelize.define('user', {
    name: DataTypes.STRING,
    lastname: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    picture: DataTypes.STRING,
    country: DataTypes.STRING,
    description: DataTypes.TEXT,
    savedRecipes: DataTypes.STRING,
    followers: DataTypes.STRING,
    blockedUsers: DataTypes.STRING
  }, {});
  user.associate = function(models) {
    models.user.hasMany(models.publication, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    models.user.hasMany(models.message, {
      as: "messageSent",
      foreignKey:"senderId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    models.user.hasMany(models.message, {
      as: "messageRecived",
      foreignKey:"receiverId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  user.beforeCreate(buildPasswordHash);
  user.beforeUpdate(buildPasswordHash);

  user.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password)
  }
  return user;
};