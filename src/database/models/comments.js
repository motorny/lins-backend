import Sequelize from 'sequelize';
import sequelizeBase from "./base";

import User from "./users";
import Item from "./items";

const Comment = sequelizeBase.define('comments', {
        comment: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        image: {
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

Comment.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}});
Comment.belongsTo(Item, {foreignKey: {name: 'item_id', allowNull: false}});

export default Comment;