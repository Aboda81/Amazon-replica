const User = require('../models/userModel');
const Address = require('../models/addressModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Snowflake = require('./snowflake'); 
const registerUser = async (req, res) => {
    const { name, email, password } = req.body; 
    try {
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const snowflake = new Snowflake();
        const id = snowflake.generate();
        user = await User.create({
            id,
            name,
            email,
            password: hashedPassword,
        });

        const payload = {id,role:user.role}
    

        jwt.sign(
            payload,
            process.env.JWT_SECRET, 
            { expiresIn: '1h' },
             (err, token) => {
                if (err) throw err;
                res.cookie('jwt',token)
                res.json({user: user.id});

            }
        );
    } catch (err) {
        console.error(err.message,);
        res.status(500).send('Server error');
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ msg: 'This email is not registered' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Wrong password' });
        }

        const payload = {
            
                id: user.id,role:user.role
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                 res.cookie('jwt',token)
                res.json({user: user.id, role:user.role});
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
        const addresses = await Address.findAll({where:{userid:user.id}})
        res.json({user,addresses});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
const changePassowrd = async (req,res) => {
    try{
        
        const user = await User.findByPk(req.user.id);
        console.log(user);
        const {oldPassword, newPassword} = req.body;
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Wrong password' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await User.update(
            { password: hashedPassword },
            {
              where: {
                id: req.user.id,
              },
            },
          )
          .then(()=>{res.status(200).json({msg:"password updated successfully"})})
    }catch(err){
        console.log(err.message);
        res.status(500).send("Server error");
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    changePassowrd,
};
