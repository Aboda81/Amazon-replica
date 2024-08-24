const mongoose = require('mongoose');
const dotenv = require("dotenv")
const Category = require("../models/categoryModel");
dotenv.config();

// Root categories and their subcategories
const rootCategories = [
  {
    name: 'Electronics',
    searchIndex: 'Electronics',
    subcategories: [
      { name: 'Accessories & Supplies' },
      { name: 'Camera & Photo' },
      { name: 'Car & Vehicle Electronics' },
      { name: 'Cell Phones & Accessories' },
      { name: 'Computers & Accessories' },
      { name: 'Electronics Warranties' },
      { name: 'GPS, Finders & Accessories' },
      { name: 'Headphones' },
      { name: 'Home Audio' },
      { name: 'Office Electronics' },
      { name: 'Portable Audio & Video' },
      { name: 'Security & Surveillance' },
      { name: 'Service Plans' },
      { name: 'Television & Video' },
      { name: 'Video Game Consoles & Accessories' },
      { name: 'Video Projectors' },
      { name: 'Wearable Technology' },
      { name: 'eBook Readers & Accessories' },
    ],
  },
  {
    name: 'Clothing, Shoes & Jewelry',
    searchIndex: 'Fashion',
    subcategories: [
      {
        name: 'Women',
        subcategories: [
          { name: 'Clothing' },
          { name: 'Shoes' },
          { name: 'Jewelry' },
          { name: 'Watches' },
          { name: 'Handbags & Wallets' },
          { name: 'Accessories' },
          { name: 'Shops' },
        ],
      },
      {
        name: 'Men',
        subcategories: [
          { name: 'Clothing' },
          { name: 'Shoes' },
          { name: 'Jewelry' },
          { name: 'Watches' },
          { name: 'Handbags & Wallets' },
          { name: 'Accessories' },
          { name: 'Shops' },
        ],
      },
      {
        name: 'Girls',
        subcategories: [
          { name: 'Clothing' },
          { name: 'Shoes' },
          { name: 'Jewelry' },
          { name: 'Watches' },
          { name: 'Handbags & Wallets' },
          { name: 'Accessories' },
          { name: 'Shops' },
        ],
      },
      {
        name: 'Boys',
        subcategories: [
          { name: 'Clothing' },
          { name: 'Shoes' },
          { name: 'Jewelry' },
          { name: 'Watches' },
          { name: 'Handbags & Wallets' },
          { name: 'Accessories' },
          { name: 'Shops' },
        ],
      },
      { name: 'Baby' },
      { name: 'Novelty & More' },
      { name: 'Luggage & Travel Gear' },
      { name: 'Uniforms, Work & Safety' },
      { name: 'Costumes & Accessories' },
      { name: 'Shoe, Jewelry & Watch Accessories' },
    ],
  },
];

// Connect to the MongoDB database
mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('Connected to the database');
    insertCategories();
  })
  .catch((error) => {
    console.error('Error connecting to the database', error);
  });

// Function to insert the categories into the database
const insertCategories = async () => {
  try {
    for (const rootCategory of rootCategories) {
      // Insert the root category
      const parentCategory = await new Category({
        name: rootCategory.name,
        searchIndex: rootCategory.searchIndex,
      }).save();

      // Insert subcategories recursively
      if (rootCategory.subcategories && rootCategory.subcategories.length > 0) {
        await insertSubcategories(rootCategory.subcategories, parentCategory._id);
      }
    }
    console.log('Categories inserted successfully');
  } catch (error) {
    console.error('Error inserting categories', error);
  } finally {
    mongoose.connection.close();
  }
};

// Recursive function to insert subcategories
const insertSubcategories = async (subcategories, parentId) => {
  for (const subcategory of subcategories) {
    const newCategory = await new Category({
      name: subcategory.name,
      parentId: parentId,
    }).save();

    if (subcategory.subcategories && subcategory.subcategories.length > 0) {
      await insertSubcategories(subcategory.subcategories, newCategory._id);
    }
  }
};
