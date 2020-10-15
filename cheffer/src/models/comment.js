'use strict';
module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }, 
    },
    userId: DataTypes.INTEGER,
    publicationId: DataTypes.INTEGER
  }, {});
  comment.associate = function(models) {
    models.comment.belongsTo(models.user, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    models.comment.belongsTo(models.publication,{
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return comment;
};