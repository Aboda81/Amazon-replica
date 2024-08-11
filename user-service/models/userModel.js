const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('user', {
    id: {
        type: DataTypes.BIGINT,
        // defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role:{
        type : DataTypes.ENUM('merchant','customer'),
        defaultValue : 'customer',
        allowNull : false,
    }
}, {
    timestamps: true,
});

module.exports = User;
