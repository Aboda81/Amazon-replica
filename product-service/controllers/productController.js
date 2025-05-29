const cloudinary = require('../config/cloudinary')
const Product = require("../models/productModel")
const Category = require("../models/categoryModel")
const Brand = require("../models/brandModel")
const fs  =require("fs")
const esClient = require('../config/esClient');
// Create Product -- 
const addProduct = async (req, res) => {
  try {
    const { name, description, price, discount, category, brand, specifications, stock } = req.body;
    const parsedSpecifications = JSON.parse(specifications);
    // const images = await req.files.map(file => file.path);
    // const CloudImages = []
  //   for (let i = 0; i < images.length; i++)
  //  await cloudinary.uploader.upload(images[i]).then(result =>{
  //     console.log(result);
  //     CloudImages.push({url:result.secure_url,publicId:result.public_id});
  //   })
    const newProduct = new Product({
      merchantId: req.user.id,
      name,
      description,
      price,
      discount,
      category,
      brand,
      specifications:parsedSpecifications,
      stock,
      iamges: [],
      sold: 0,
      wishlisted: 0,
    });

    const savedProduct = await newProduct.save();

    const categoryName = (await Category.findById(savedProduct.category).select("name")).name;
    const brandName = (await Brand.findById(savedProduct.brand).select("name")).name;

    // Index the product in Elasticsearch
    await esClient.index({
      index: 'products',
      id: savedProduct._id.toString(),
      document: {
      name: savedProduct.name,
      category: categoryName,
      brand: brandName,
      specifications: Object.values(savedProduct.specifications || {}).join(' '),
      price: savedProduct.price,
      rating: savedProduct.rating,
      popularity: savedProduct.wishlisted + savedProduct.sold,
      }
    });
    
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// request signature for cloudinary -- Done
const requestSignature = async (req, res) => {
  const {productId} = req.params;
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `products/${req.user.id}/${productId}`;
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUD_API_SECRET
  );
  res.status(200).json({ signature, timestamp, folder });

}
// upload images to cloudinary -- Done
const uploadImages = async (req, res) => { 
  try {
  const {productId} = req.params;
  const images = req.body.images; //
  await Product.findByIdAndUpdate(
    productId,
    { $push: { images: { $each: images } } },
    { new: true }
  );
  res.status(200).json({ message: "Images uploaded successfully" });
}
catch (error) {
  res.status(500).json({ message: error.message });
}


}
// get Product by ID for any user (doesn't get sensitive data) -- Done 
const getProductbyId = async(req,res)=>{
  const id = req.params.id;
  const product = await Product.findById(id).select({"sold":0,"wishlisted":0,"createdAt":0,"updatedAt":0});
  const category = await Category.findById(product.category).select("name")
  const brand = await Brand.findById(product.brand).select("name")
  res.status(200).json({product,category,brand});

};


// upddate product -- Problem with the request body
const updateProduct = async(req,res)=>{
  
  const productId = req.params.id;
  const merchantId = req.user.id;
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
  const merchantId = req.user.id;
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
  const merchantId = req.user.id;
  console.log(merchantId);
  
  try{
    const products = await Product.find({merchantId})
    res.status(200).json(products)
  }
  catch(error){
    res.status(500).json({message:error.message});
  }
}
const getStock = async (req,res) =>{
  const {productId} = req.params
  try{
    product = await Product.findById(productId).select("stock")
    if(!product){
      res.status(500).json({message:"Product not found"})
    }
    res.status(200).json(product.stock)
  }
  catch(error){
    console.log(error.message);
    res.status(500).json({message:"server error"})
    
  }
}


module.exports = {
  addProduct,
  getProductbyId,
  updateProduct,
  deleteProduct,
  getMerchantProducts,
  getStock,
  requestSignature,
  uploadImages,
};
