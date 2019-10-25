require('dotenv').config();

module.exports = {
  development: {
    storage: process.env.DEV_DATABASE_URL,
    dialect: 'sqlite',
  }
};
