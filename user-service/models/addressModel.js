const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Address = sequelize.define('address', {
    id: {
        type: DataTypes.BIGINT,
        // defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userid: {
        type: DataTypes.BIGINT,
        // defaultValue: DataTypes.UUIDV4,
        foreignkey: true,
    },
    country: {
        type : DataTypes.STRING,
        allowNull :false,
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phonenumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    street: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    buildingno: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    postalcode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    district: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    governorate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    landmark: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: false,
});

module.exports = Address;
