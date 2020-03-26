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
    return queryInterface.bulkInsert('profiles', [{
      username: 'Johny',
      image: 'https://123.com',
      location: 'home',
      role: 'user',
      contact: '8-921-123-345',
      points: '0',
      user_id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      username: 'Anna-Maria',
      image: 'https://123Annet.com',
      location: 'Johnys home',
      role: 'admin',
      contact: '8-921-123-345-567',
      points: '1',
      user_id: '2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      username: 'Johnys Brother',
      image: 'https://bro.com',
      location: 'Anna-Marias home',
      role: 'user',
      contact: '8-921-123-22345',
      points: '22',
      user_id: '3',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      username: 'Johnys Sister',
      image: 'https://sis.com',
      location: 'work',
      role: 'user',
      contact: '8-921-123-345',
      points: '99',
      user_id: '4',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
      {
        username: 'Elon Muskatron',
        image: 'https://tesla.com',
        location: 'work',
        role: 'user',
        contact: '8-921-123-345',
        points: '995',
        user_id: '5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'Strange Donny',
        image: 'https://lol.com',
        location: 'zzz',
        role: 'user',
        contact: '8-921-123-345',
        points: '2',
        user_id: '6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'Infinity',
        image: 'https://blackhole.com',
        location: 'black hole',
        role: 'admin',
        contact: '8-921-123-345',
        points: '99',
        user_id: '7',
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
