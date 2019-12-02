'use strict';
//Validations are automatically run on create, update and save. You can also call validate() to manually validate an instance.

import sequelizeBase from "./base";
import Sequelize from 'sequelize';
import User from "./users";
import Storage from "./storages";

const Profile = sequelizeBase.define('profiles', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            //uniqie?
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
            unique: {
                args: true,
                msg: 'This username is already existing. Choose something else'
            },
        },
        image_url: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: false,
            }
        },
        location: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: true,
            }
        },
        role: {
            type: Sequelize.INTEGER,
            foreignKey: true,
        },
        contact: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: true,
            }
        },
        points: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        }
    },
    //Custom options
    {
        freezeTableName: true,
        name: {
            singular: 'profile',
            plural: 'profiles',
        },
        timestamps: true,
    });
Profile.belongsTo(User, {foreignKey: 'user_id'});
export default Profile;