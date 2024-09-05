const express = require('express');
const router = express.Router();
const {addToCart,getCart,removeFromCart} = require('../controllers/cartController')
const {isUser} = require('../middlewares/authMiddleware')
router.post('/addToCart',isUser,addToCart)
router.get('/mycart',isUser,getCart)
router.delete('/remove/:productId',isUser,removeFromCart)

module.exports = router