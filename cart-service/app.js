const express = require('express');
const cartRoutes = require('./routes/cartRoutes');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser")

dotenv.config();

const app = express();


app.use(express.json());
app.use(cookieParser());    
app.use('/api/cart', cartRoutes);

module.exports = app;
