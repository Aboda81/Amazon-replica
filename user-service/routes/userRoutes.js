const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { addAddress,deleteAddress,updateAddress} = require('../controllers/adressController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/addAddress',protect,addAddress);
router.post('/deleteAddress',protect,deleteAddress);
router.post('/updateAddress',protect,updateAddress);

module.exports = router;
