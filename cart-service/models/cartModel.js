const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity can not be less than 1.']
    
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});
const cartSchema = new mongoose.Schema({
    userId: {
      type: Number,
      ref: 'User',
      required: true,
      unique: true
    },
    items: [cartItemSchema],
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });
  
  const Cart = mongoose.model('Cart', cartSchema);
  
  module.exports = Cart;
  