import Sequelize from 'sequelize';
import sequelizeBase from "./base";

import Profile from "./profile";
import Item from "./items";

const Comment = sequelizeBase.define('comments', {
        comment: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        image_url: {
            type: Sequelize.STRING,
            allowNull: true,

        },
        title: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
    },
    {
        name: {
            singular: 'comment',
            plural: 'comments',
        },
        freezeTableName: true
    });

Comment.belongsTo(Profile, {foreignKey: {name: 'user_id', allowNull: false}});
Comment.belongsTo(Item, {foreignKey: {name: 'item_id', allowNull: false}});

export default Comment;