const Cart = require('../models/cartModel');
const axios = require("axios")

// Add to Cart
const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  
  try {
    let cart = await Cart.findOne({ userId });
    const response = await axios.get(`http://localhost:8030/api/products/stock/${productId}`);
    const stock = response.data
    if (cart) {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = parseInt(quantity,10)+parseInt(cart.items[itemIndex].quantity,10);
      } else {
        cart.items.push({ productId, quantity });
      }
      cart.updatedAt = Date.now();
    } else {
      
      cart = new Cart({
        userId,
        items: [{ productId, quantity }]
      });
    }
    if(cart.items[cart.items.findIndex(item => item.productId.toString() === productId)].quantity>stock){
      res.status(500).json({message:`The seller has only ${stock} of these available`})
      return
    }
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.log(error.message);
    
    res.status(500).json({ message: 'Server error' });
  }
};
const getCart = async (req,res) =>{
  const userId = req.user.id;
  try{
    cart = await Cart.findOne({userId})
    if(!cart){
      cart = new Cart({
        userId,
        items: []
      });
      await cart.save();
    }
    res.status(200).json(cart)

  }
  catch(error){
    console.log(error.message);
    
    res.status(500).json({ message: 'Server error' });
  }
}
const removeFromCart = async (req,res) =>{
  const userId = req.user.id
  const {productId} = req.params
  try{
   await Cart.updateOne({userId},
      {
        $pull:{
          items:{productId}
        }
      }
    )
    const cart = await Cart.findOne({userId})
    res.status(200).json(cart)
  }catch(error){
    console.log(error.message);
    res.status(500).json({message:"server Error"})
  }
} 
module.exports ={addToCart,getCart,removeFromCart}
