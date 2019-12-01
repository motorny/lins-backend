require('dotenv').config();
const path = require('path');

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './dev_database.sqlite',
    logging: false,
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
  },
};
