'use strict';
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
  return user;
};