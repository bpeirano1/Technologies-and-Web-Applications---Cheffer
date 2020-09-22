'use strict';
module.exports = (sequelize, DataTypes) => {
  const report = sequelize.define('report', {
    publicationId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {});
  report.associate = function(models) {
    // associations can be defined here
  };
  return report;
};