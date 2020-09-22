'use strict';
module.exports = (sequelize, DataTypes) => {
  const publication = sequelize.define('publication', {
    name: DataTypes.STRING,
    recipesPictures: DataTypes.STRING,
    ingredients: DataTypes.STRING,
    recipesVideos: DataTypes.STRING,
    time: DataTypes.FLOAT,
    userId: DataTypes.INTEGER,
    steps: DataTypes.STRING,
    ranking: DataTypes.FLOAT,
    stepsPictures: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {});
  publication.associate = function(models) {
    // associations can be defined here
  };
  return publication;
};