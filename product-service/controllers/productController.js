const cloudinary = require('../config/cloudinary')
const Product = require("../models/productModel")
const fs  =require("fs")
// Create Product -- DONE
const addProduct = async (req, res) => {
  try {
    const { name, description, price, discount, category, brand, specifications, stock } = req.body;
    const images = await req.files.map(file => file.path);
    const parsedSpecifications = JSON.parse(specifications);
    const CloudImages = []
    for (let i = 0; i < images.length; i++)
   await cloudinary.uploader.upload(images[i]).then(result =>{
      console.log(result);
      CloudImages.push({url:result.secure_url,publicId:result.public_id});
    })
    const newProduct = new Product({
      merchantId: req.merchant.id,
      name,
      description,
      price,
      discount,
      category,
      brand,
      specifications:parsedSpecifications,
      stock,
      images:CloudImages,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// get Product by ID for any user (doesn't get sensitive data) -- Done
const getProductbyId = async(req,res)=>{
  const id = req.params.id;
  const product = await Product.findById(id).select({"sold":0,"wishlisted":0,"createdAt":0,"updatedAt":0});
  res.status(200).json(product);

};
// upddate product -- Problem with the request bodu=y
const updateProduct = async(req,res)=>{
  
  const productId = req.params.id;
  const merchantId = req.merchant.id;
  try{
    console.log(req.body);

    const product = await Product.findOneAndUpdate({_id:productId,merchantId},{$set:req.body});    
    res.status(200).json(product);
  }catch(error){
    res.status(500).json({message:error.message})
  }
}
// Delete Product -- test Done
const deleteProduct = async(req,res)=>{
  const productId = req.params.id;
  const merchantId = req.merchant.id;
  try{
    const product = await Product.findOne({_id:productId,merchantId})
    if(!product){
      res.status(500).json({message:"This Product doesn't exist or you don't own this product"});
      return
    }
    for (let i = 0; i < product.images.length; i++) {
      cloudinary.uploader.destroy(product.images[i].publicId, function(error, result) {
        if (error) {
          console.error('Error deleting image:', error);
        } else {
          console.log('Image deleted successfully:', result);
        }
      });     console.log(product.images[i].publicId)
    }
    await Product.findByIdAndDelete(product._id)


    res.status(200).json({message:"Product Deleted Successfully"})
  }
  catch(error){
    res.status(500).json({message:error.message})

  }
}
// get all Merchant Products -- Done 
const getMerchantProducts = async (req,res) =>{
  const merchantId = req.merchant.id;
  try{
    const products = await Product.find({merchantId})
    res.status(200).json(products)
  }
  catch(error){
    res.status(500).json({message:error.message});
  }
}


module.exports = {
  addProduct,
  getProductbyId,
  updateProduct,
  deleteProduct,
  getMerchantProducts,
};
