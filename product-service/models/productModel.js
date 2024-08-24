const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  merchantId :{
    type:Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount :{
    type: Number,
    required: false,
    min :1,
    max:99,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  brand:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
  },
  rating:{
    type: Number,
    min:0,
    max:5,
    required:true,
    default:0,
  },
  specifications:{
    type: Map,
    of: String,
  },
  stock:{
    type: Number,
    min:0,
    required: true,
  },
  sold:{
    type: Number,
    required: true,
    default:0,
    min:0,
  },
  wishlisted:{
    type: Number,
    required: true,
    default:0,
    min:0,
  },
  images: [{
    url:{
      type: String,
    },
    publicId:{
      type:String
    }
  }],

}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
