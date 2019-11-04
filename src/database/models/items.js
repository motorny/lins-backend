import Sequelize from 'sequelize';
import sequelizeBase from "./base";

import Storage from "./storage";


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
        status: {
            type: Sequelize.INTEGER,
            allowNull: false
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
export default Item;