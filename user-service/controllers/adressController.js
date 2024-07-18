const User = require('../models/userModel');
const Address = require('../models/addressModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Snowflake = require('./snowflake'); 
const addAddress = async (req, res) => {
    try{
    const { country, fullname,phonenumber,street,buildingno,postalcode,city,district,governorate,landmark} = req.body;
    const snowflake = new Snowflake();
    const id = snowflake.generate();
    const address = await Address.create({
        id,
        userid: req.user.id,
        country,
        fullname,
        phonenumber,
        street,
        buildingno,
        postalcode,
        city,
        district,
        governorate,
        landmark,
})
res.json(address);
        } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
const deleteAddress = async (req,res) =>{
    try{
        const id = req.params.id;
        const address = Address.destroy({where:{id,userid:req.user.id}})
        res.status(200).json(address);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
const updateAddress = async (req,res) =>{
    try{
        const {country, fullname,phonenumber,street,buildingno,postalcode,city,district,governorate,landmark} = req.body;
        const id = req.params.id;
        const newAddress = Address.update({country, fullname,phonenumber,street,buildingno,postalcode,city,district,governorate,landmark},{where:{id,userid:req.user.id}})
        res.status(200).json(newAddress);
    } catch(err){
        console.error.log(err.message);
        res.status(500).send('Server error');
    }
}
module.exports = {
    addAddress,
    deleteAddress,
    updateAddress,
};
