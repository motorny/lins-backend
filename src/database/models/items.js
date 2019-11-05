import Sequelize from 'sequelize';
import sequelizeBase from "./base";

import Storage from "./storage";
import ItemStatus from "./itemStatuses";

const Item = sequelizeBase.define('items',{
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        image: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.TEXT,
        },
    },
    {
        name: {
            singular: 'item',
            plural: 'items',
        },
        freezeTableName: true
    });

Item.belongsTo(Storage, {foreignKey: 'storage_id'});
Item.belongsTo(ItemStatus, {foreignKey: 'status'});
export default Item;