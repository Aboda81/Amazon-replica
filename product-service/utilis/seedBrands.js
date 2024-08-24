const mongoose = require('mongoose');
const dotenv = require("dotenv")
const Brand = require("../models/brandModel");
dotenv.config();

mongoose.connect(process.env.DATABASE_URL)
  .then( async () => {
    console.log('Connected to the database');
    brand = new Brand({
        name: "SAMSUNG",
        description: "this is samsung description"
    })
    await brand.save()
})
  .catch((error) => {
    console.error('Error connecting to the database', error);
  }).finally(()=>{
    mongoose.connection.close();

  });