'use strict';
module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {});
  message.associate = function(models) {
    models.message.belongsTo(models.user, {
      as:"sender",
      foreignKey:"senderId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    models.message.belongsTo(models.user, {
      as:"receiver",
      foreignKey:"receiverId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return message;
};