'use strict';

const bcrypt = require('bcrypt');
const PASSWORD_SALT = 10; // veces que se encripta la constraseña

async function buildPasswordHash(instance) {
  if (instance.changed('password')){
    const hash = await bcrypt.hash(instance.password, PASSWORD_SALT);
    instance.set('password', hash);
  }
}

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }, 
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }, 
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }, 
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }, 
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }, },
    picture: {
      type: DataTypes.STRING,},
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }, },
    description: {
      type: DataTypes.TEXT,},
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
    models.user.belongsToMany(models.user,{
      through: "user_followers",
      as: "follows",
      foreignKey: "userFollowedId",
    });

    models.user.belongsToMany(models.user,{
      through: "user_followers",
      as: "followed",
      foreignKey: "userFollowsId",

    });

    models.user.belongsToMany(models.publication,{
      through: "likes",
      as: "likedPublication",
      foreignKey: "userId",

    });

    models.user.belongsToMany(models.publication,{
      through: "saved_publications",
      as: "savedPublication",
      foreignKey: "userId",

    });
  };


  user.beforeCreate(buildPasswordHash);
  user.beforeUpdate(buildPasswordHash);

  user.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password)
  }
  return user;
};