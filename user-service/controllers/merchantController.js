const Merchant = require('../models/merchantModel');
const Address = require('../models/addressModel');
const User = require('../models/userModel');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Snowflake = require('./snowflake'); 
const registerMerchant = async (req,res)=>{
    const {name, email, password, phonenumber, govid, businessname, taxinfo, bankaccountnumber,
        country, street, buildingno, postalcode, city, district, governorate, landmark} = req.body
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const snowflake = new Snowflake();
        const merchantID = snowflake.generate();
        const addressId = snowflake.generate();
    try{
       const user =  await User.create({
            id:merchantID,
            name,
            email,
            password:hashedPassword,
            role:'merchant'
        })
        const merchant = await Merchant.create({
            id:merchantID,
            phonenumber,
            govid,
            businessname,
            taxinfo,
            bankaccountnumber,
        })
        const address = await Address.create({
            id:addressId,
            userid: merchantID,
            country,
            fullname:name,
            phonenumber,
            street,
            buildingno,
            postalcode,
            city,
            district,
            governorate,
            landmark,
    })
    jwt.sign(
        {id:merchantID,role:user.role},
        process.env.JWT_SECRET, 
        { expiresIn: '1h' },
         (err, token) => {
            if (err) throw err;
            res.cookie('jwt',token)
            res.status(200).json({user,merchant,address})
        }
    );    

    }
    catch (err) {
        console.error(err.message);
        User.destroy({where:{id: merchantID}})
        Merchant.destroy({where:{id: merchantID}})
        res.status(500).send('Server error');
    }
}


module.exports ={registerMerchant}
