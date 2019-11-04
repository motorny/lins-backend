'use strict';
//Validations are automatically run on create, update and save. You can also call validate() to manually validate an instance.
const crypto = require('crypto');
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

const Profile = sequelize.define('profiles', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            //uniqie?
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
            unique: {
                args: true,
                msg: 'This username is already existing. Choose something else'
            },
        },
        password_hash: DataTypes.STRING,
        password_salt: DataTypes.STRING,
        password: {
            type: DataTypes.VIRTUAL,
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
            type: DataTypes.STRING,
            validate: {
                isUrl: true,
                notEmpty: false,
            }
        },
        location: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true,
            }
        },
        role: {
            type: DataTypes.INTEGER,
            foreignKey: true,
        },
        contact: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true,
            }
        },
        points: {
            type: DataTypes.INTEGER,
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