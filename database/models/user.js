'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    name: DataTypes.STRING,
    password: DataTypes.STRING
  }, { freezeTableName: true,
    timestamps: false,});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};