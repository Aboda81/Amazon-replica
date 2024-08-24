const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const isMerchant = asyncHandler(async (req, res, next) => {
    let token;

        try {
            token = req.cookies.jwt
            console.log(token);
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.role !== 'merchant') {
                return res.status(403).json({ message: 'Access denied. Only merchants can perform this action.' });
            }
            req.merchant = decoded;
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = { isMerchant };
