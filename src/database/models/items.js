'use strict';

module.exports = (sequelize, DataTypes) => {
    const Items = sequelize.define('items', {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            image: {
                type: DataTypes.STRING,
            },
            description: {
                type: DataTypes.TEXT,
            },
            storage_id: {
                type: DataTypes.INTEGER,
                foreignKey: true,
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

        },
        //Custom options
        {
            freezeTableName: true,
            timestamps: true,
        });
    Items.associate = function(models) {
        // associations can be defined here
    };
    return Items;
};