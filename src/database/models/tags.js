import Sequelize from 'sequelize';
import sequelizeBase from "./base";

import Item from "./itemStatuses";

const Tag = sequelizeBase.define('tags',{
        tag: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    },
    {
        name: {
            singular: 'tag',
            plural: 'tags',
        },
        freezeTableName: true,
        timestamps: false
    });

Tag.belongsToMany(Item, {through: 'itemTagLink',timestamps: false,otherKey: 'itemId'});
export default Tag;