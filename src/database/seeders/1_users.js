'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkInsert('People', [{
            name: 'John Doe',
            isBetaMember: false
          }], {});
        */
        return queryInterface.bulkInsert('users', [
            {
                login: 'johndoe@yourmum.com',
                password: '$2a$10$DXYW9p9Mjs87X8xdGqU9eeRPUn8kshpd/GcTfwlvx5pxAR6T4.com',
                createdAt: new Date(),
                updatedAt: new Date(),
                isAdmin: false,
            },
            {
                login: 'ceo@lins.com',
                password: '$2a$10$DXYW9p9Mjs87X8xdGqU9eeRPUn8kshpd/GcTfwlvx5pxAR6T4.com',
                createdAt: new Date(),
                updatedAt: new Date(),
                isAdmin: true,
            },
            {
                login: 'waitress@lins.com',
                password: '$2a$10$DXYW9p9Mjs87X8xdGqU9eeRPUn8kshpd/GcTfwlvx5pxAR6T4.com',
                createdAt: new Date(),
                updatedAt: new Date(),
                isAdmin: false,
            },
            {
                login: 'plane@nasa.com',
                password: '$2a$10$DXYW9p9Mjs87X8xdGqU9eeRPUn8kshpd/GcTfwlvx5pxAR6T4.com',
                createdAt: new Date(),
                updatedAt: new Date(),
                isAdmin: false,
            },
            {
                login: 'elon@musk.com',
                password: '$2a$10$DXYW9p9Mjs87X8xdGqU9eeRPUn8kshpd/GcTfwlvx5pxAR6T4.com',
                createdAt: new Date(),
                updatedAt: new Date(),
                isAdmin: false,
            },
            {
                login: 'i@dont.know',
                password: '$2a$10$DXYW9p9Mjs87X8xdGqU9eeRPUn8kshpd/GcTfwlvx5pxAR6T4.com',
                createdAt: new Date(),
                updatedAt: new Date(),
                isAdmin: false,
            },
            {
                login: 'omg@how.many',
                password: '$2a$10$DXYW9p9Mjs87X8xdGqU9eeRPUn8kshpd/GcTfwlvx5pxAR6T4.com',
                createdAt: new Date(),
                updatedAt: new Date(),
                isAdmin: false,
            }], {});
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkDelete('People', null, {});
        */

    }
};
