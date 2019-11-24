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
    return queryInterface.bulkInsert('items', [{
      name: 'Pen',
      image: 'pen_image',
      description: 'Small pen with rubber at the end',
      storage_id: '1',
      status: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
      {
        name: 'Pineapple',
        image: 'pineapple_image',
        description: 'tasty pineapple',
        storage_id: '2',
        status: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Apple',
        image: 'apple_image',
        description: 'probably expired',
        storage_id: '1',
        status: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Pen',
        image: 'pen2_image',
        description: 'another pen, not so good as last one',
        storage_id: '4',
        status: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
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
