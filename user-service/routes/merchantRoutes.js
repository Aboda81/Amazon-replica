const express = require('express');
const { registerMerchant} = require('../controllers/merchantController');
const router = express.Router();
router.post('/register',registerMerchant)
module.exports = router