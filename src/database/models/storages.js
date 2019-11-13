import Sequelize from 'sequelize';
import sequelizeBase from "./base";
import User from "./users";


const Storage = sequelizeBase.define('storages',{
        name: {
            type:Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        location: {
            type:Sequelize.STRING
        },
        description: {
            type:Sequelize.STRING
        },
    },
    {
        name: {
            singular: 'storage',
            plural: 'storages',
        },
        modelName: 'storages',
        freezeTableName: true
    });

Storage.belongsTo(User, {foreignKey: 'owner_id'});
export default Storage;