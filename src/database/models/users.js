import Sequelize from 'sequelize';
import sequelizeBase from "./base";


const User = sequelizeBase.define('users',{
        login: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            },
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        name: {
            singular: 'user',
            plural: 'users',
        },
        freezeTableName: true
    });

export default User;