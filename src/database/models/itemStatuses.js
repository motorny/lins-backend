import Sequelize from 'sequelize';
import sequelizeBase from "./base";


const ItemStatus = sequelizeBase.define('itemStatuses',{
        status: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    },
    {
        name: {
            singular: 'itemStatus',
            plural: 'itemStatuses',
        },
        freezeTableName: true,
        timestamps: false
    });

export default ItemStatus;