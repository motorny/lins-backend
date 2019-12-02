'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('comments', [{
      comment: 'Good item, liked it!',
      title: 'Worth taking',
      createdAt: new Date(),
      updatedAt: new Date(),
      user_id: 1,
      item_id: 1,
    },
      {
        comment: 'Good item, liked it very much!',
        title: 'Good item',
        createdAt: new Date(),
        updatedAt: new Date(),
        user_id: 2,
        item_id: 1,
      },
      {
        comment: 'Not good item, liked it!',
        title: "Don't take it!",
        createdAt: new Date(),
        updatedAt: new Date(),
        user_id: 3,
        item_id: 2,
      },
      {
        comment: 'Great perehodnik, liked it!',
        title: 'Daite dva',
        createdAt: new Date(),
        updatedAt: new Date(),
        user_id: 4,
        item_id: 3,
      },
      {
        comment: "Didn't work at 2k",
        title: "Trash!!!",
        createdAt: new Date(),
        updatedAt: new Date(),
        user_id: 6,
        item_id: 2,
      },
      {
        comment: "Wasn't long enough",
        title: "Don't take it)",
        createdAt: new Date(),
        updatedAt: new Date(),
        user_id: 6,
        item_id: 4,
      }])
  }
};
