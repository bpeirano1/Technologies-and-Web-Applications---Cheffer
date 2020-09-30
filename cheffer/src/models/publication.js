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