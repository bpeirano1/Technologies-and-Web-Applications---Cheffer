'use strict';
module.exports = (sequelize, DataTypes) => {
  const report = sequelize.define('report', {
    publicationId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      }, 
    },
  }, {});
  report.associate = function(models) {
    models.report.belongsTo(models.user,{
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    models.report.belongsTo(models.publication, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return report;
};