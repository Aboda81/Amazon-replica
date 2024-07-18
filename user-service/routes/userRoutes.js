const express = require('express');
const { registerUser, loginUser, getUserProfile,changePassowrd } = require('../controllers/userController');
const { addAddress,deleteAddress,updateAddress} = require('../controllers/adressController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/addAddress',protect,addAddress);
router.delete('/deleteAddress/:id',protect,deleteAddress);
router.put('/updateAddress/:id',protect,updateAddress);
router.put('/changePassword',protect,changePassowrd);

module.exports = router;
