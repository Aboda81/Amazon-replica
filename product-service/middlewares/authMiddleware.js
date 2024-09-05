const axios = require("axios")
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
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

module.exports = { isMerchant };
