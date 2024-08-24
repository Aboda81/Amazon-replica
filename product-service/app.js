const express = require('express');
const productRoutes = require('./routes/productRoutes');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser")

dotenv.config();

const app = express();


app.use(express.json());
app.use(cookieParser());    
app.use('/api/products', productRoutes);

module.exports = app;
