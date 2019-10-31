'use strict';
module.exports = (sequelize, DataTypes) => {
    const Storage = sequelize.define('storage', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type:DataTypes.STRING,
            },
            location: {
                type:DataTypes.STRING
            },
            description: {
                type:DataTypes.STRING
            },
            owner_id: {
                type:DataTypes.INTEGER
            }
        },
        {
            freezeTableName: true,
            timestamps: true,
        });
    Storage.associate = function (models) {
        // associations can be defined here
    };
    return Storage;
};