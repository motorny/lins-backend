import Sequelize from 'sequelize';
import sequelizeBase from "./base";

import Item from "./items";

const Tag = sequelizeBase.define('tags',{
        tag: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
            unique: true
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

Tag.belongsToMany(Item, {through: 'itemTagLink',timestamps: false});
Item.belongsToMany(Tag, {through: 'itemTagLink',timestamps: false});
export default Tag;