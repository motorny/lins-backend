'use strict';
//Validations are automatically run on create, update and save. You can also call validate() to manually validate an instance.
module.exports = (sequelize, DataTypes) => {
    const Profile = sequelize.define('profile', {
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
        },
        password_hash: DataTypes.STRING,
        password: {
            type: DataTypes.VIRTUAL,
            set: function (val) {
                this.setDataValue("password", val);
                this.setDataValue("password_hash", val + val);
            },
            validate: {
                isLongEnough: function (val) {
                    if (val.length < 7) {
                        throw new Error("Please choose a longer password")
                    }
                }
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
        timestamps: true,
    });
    Profile.associate = function(models) {
        // associations can be defined here
    };
    return Profile;
};