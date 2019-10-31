'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('profile', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        unique: true,
      },
      password_hash: Sequelize.STRING,
      password_salt: Sequelize.STRING,
      image_url: {
        type: Sequelize.STRING,
        validate: {
          isUrl: true,
          notEmpty: false,
        }
      },
      location: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
        }
      },
      role: {
        type: Sequelize.INTEGER,
        foreignKey: true,
      },
      contact: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
        }
      },
      points: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('profile');
  }
};