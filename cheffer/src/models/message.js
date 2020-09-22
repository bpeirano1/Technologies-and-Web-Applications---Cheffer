'use strict';
module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {});
  message.associate = function(models) {
    // associations can be defined here
  };
  return message;
};