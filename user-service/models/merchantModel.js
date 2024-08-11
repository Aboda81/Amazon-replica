const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Merchant = sequelize.define('merchant', {
    id: {
        type: DataTypes.BIGINT,
        // defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        foreignkey: true,
    },
    phonenumber:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    govid : {
    type: DataTypes.STRING,
    allowNull:false,
    unique : true,
    },
    businessname :{
        type: DataTypes.STRING,
        allowNull:false,
        unique : true,   
    },
    taxinfo:{
        type: DataTypes.STRING,
        allowNull:false,
        unique : true,   
    },
    bankaccountnumber:{
        type: DataTypes.STRING,
        allowNull:false,
        unique : true,     
    }


}, {
    timestamps: true,
});

module.exports = Merchant;
