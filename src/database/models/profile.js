'use strict';
//Validations are automatically run on create, update and save. You can also call validate() to manually validate an instance.
const crypto = require('crypto');
import sequelizeBase from "./base";
import Sequelize from 'sequelize';
/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
const genRandomString = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
const sha512 = function (password, salt) {
    const hash = crypto.createHmac('sha512', salt);
    /** Hashing algorithm sha512 */
    hash.update(password);
    const value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

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
        password_hash: Sequelize.STRING,
        password_salt: Sequelize.STRING,
        password: {
            type: Sequelize.VIRTUAL,
            set: function (val) {
                this.setDataValue("password", val);
                const salt = genRandomString(16);
                /** Gives us salt of length 16 */
                const encodedPassword = sha512(val, salt);
                this.setDataValue("password_hash", encodedPassword.passwordHash);
                this.setDataValue("password_salt", encodedPassword.salt);
            },
        },
        image_url: {
            type: Sequelize.STRING,
            validate: {
                isUrl: true,
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

export default Profile;