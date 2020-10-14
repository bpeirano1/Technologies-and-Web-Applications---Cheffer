'use strict';
module.exports = (sequelize, DataTypes) => {
  const publication = sequelize.define('publication', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }, 
    recipesPictures: DataTypes.STRING,
    ingredients: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }, 
    recipesVideos: DataTypes.STRING,
    time: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }, 
    userId: DataTypes.INTEGER,
    steps: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    ranking: DataTypes.FLOAT,
    stepsPictures: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {});
  publication.associate = function(models) {
    models.publication.belongsTo(models.user);
    models.publication.hasMany(models.comment,{
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    models.publication.hasMany(models.report,{
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
  };
  return publication;
}; 