const express = require('express');
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const merchantRoutes = require('./routes/merchantRoutes')
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser")

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());    
app.use('/api/users', userRoutes);
app.use('/api/merchants',merchantRoutes)

module.exports = app;
