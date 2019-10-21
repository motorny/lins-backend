require('dotenv').config();

module.exports = {
  development: {
    //url: process.env.DEV_DATABASE_URL,
    //dialect: 'postgres',
    dialect: 'sqlite',
    storage: process.env.DEV_DATABASE_URL,
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
};
/* CREATE TABLE profile (
    id            INTEGER PRIMARY KEY,
    username      STRING,
    password_hash STRING,
    image_url     STRING,
    location      STRING,
    contact       STRING,
    points        INTEGER DEFAULT (0),
    createdAt     TIME,
    updatedAt     TIME
) */