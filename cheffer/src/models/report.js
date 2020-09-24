'use strict';
module.exports = (sequelize, DataTypes) => {
  const report = sequelize.define('report', {
    publicationId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {});
  report.associate = function(models) {
    models.report.belongsTo(models.user);
    models.report.belongsTo(models.publication);
  };
  return report;
};