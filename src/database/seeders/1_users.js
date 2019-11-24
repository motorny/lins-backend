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
    return queryInterface.bulkInsert('users', [{
      login: 'johndoe@yourmum.com',
      password: 'encrypted_ting',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
      {
        login: 'ceo@lins.com',
        password: 'so_encrypted_ting',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        login: 'waitress@lins.com',
        password: 'qwerty',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        login: 'plane@nasa.com',
        password: 'sae6235asg@@$gst76',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        login: 'elon@musk.com',
        password: 'gint_detpyrcne',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        login: 'i@dont.know',
        password: 'bored_a_bit',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        login: 'omg@how.many',
        password: 'more',
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
