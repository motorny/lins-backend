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
    return queryInterface.bulkInsert('storages', [{
      name: 'Johnys storage',
      location: 'Johnys home',
      description: 'locker for johnys stuff',
      createdAt: new Date(),
      updatedAt: new Date(),
      owner_id: '1',
      primary: true,
    },
      {
        name: 'Lins private locker',
        location: 'Lins headquarters',
        description: 'secret locker for you know what stuff hehe',
        createdAt: new Date(),
        updatedAt: new Date(),
        owner_id: '2',
        primary: true,
      },
      {
        name: 'waitress locker',
        location: '4th floor',
        description: 'glasses and something else',
        createdAt: new Date(),
        updatedAt: new Date(),
        owner_id: '3',
        primary: true,
      },
      {
        name: 'plane locker',
        location: 'on the plane',
        description: 'space for other planes',
        createdAt: new Date(),
        updatedAt: new Date(),
        owner_id: '4',
        primary: true,
      },
      {
        name: 'elons locker',
        location: 'elons home',
        description: 'teslas and stuff',
        createdAt: new Date(),
        updatedAt: new Date(),
        owner_id: '5',
        primary: true,
      },
      {
        name: 'another one',
        location: 'somewhere',
        description: 'anything is possible',
        createdAt: new Date(),
        updatedAt: new Date(),
        owner_id: '6',
        primary: true,
      },
      {
        name: '...and another one',
        location: 'end of universe',
        description: 'currently unknown whats inside',
        createdAt: new Date(),
        updatedAt: new Date(),
        owner_id: '7',
        primary: true,
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
