const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // e.g. 'laptops'
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  ancestors: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
      name: String,
      slug: String
    }
  ]
});
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;