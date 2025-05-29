const axios = require("axios")
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Product = require("../models/productModel")

const isMerchant = asyncHandler(async (req, res, next) => {
    let token;

        try {
            token = req.cookies.jwt

            // Send token to User Service for validation
    const response = await axios.get('http://localhost:8020/api/users/validate-token', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.data.user.role !== 'merchant') {
        return res.status(403).json({ message: 'Access denied. Only merchants can perform this action.' });
    }
    req.user = response.data.user;
    next();
        } catch (error) {
            console.error(error.message);
            res.status(401);
            // throw new Error('Not authorized, token failed');
        }
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const isProductOwner = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const token = req.cookies.jwt;

    try {
        // Send token to User Service for validation
        const response = await axios.get('http://localhost:8020/api/users/validate-token', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data.user.role !== 'merchant') {
            return res.status(403).json({ message: 'Access denied. Only merchants can perform this action.' });
        }
        req.user = response.data.user;
        const product = await Product.findById(productId).select("merchantId")
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.merchantId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied. You are not the owner of this product.' });
        }
        next();
    } catch (error) {
        console.error(error.message);
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
});
module.exports = { isMerchant,isProductOwner };
