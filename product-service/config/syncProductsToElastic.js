const mongoose = require('mongoose');
const Product = require('../models/productModel'); // Adjust path to your product model
const esClient = require('./esClient'); // Adjust path to your Elasticsearch client configuration

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/your_db_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  syncProducts();
}).catch(err => console.error('MongoDB error:', err));

async function syncProducts() {
  try {
    const products = await Product.find().populate('brand').populate('category');

    const bulkOps = [];

    products.forEach(product => {
      bulkOps.push({
        index: {
          _index: 'products',
          _id: product._id.toString(),
        },
      });

      bulkOps.push({
        name: product.name,
        description: product.description,
        price: product.price,
        discount: product.discount || 0,
        brand: product.brand?.name || '', // ensure brand is string
        category: product.category?.name || '',
        rating: product.rating,
        popularity: product.sold, // you can use `sold` as popularity
        specifications: product.specifications,
        stock: product.stock,
      });
    });

    const { body } = await esClient.bulk({ refresh: true, operations: bulkOps });
    console.log('Bulk indexing complete. Errors:', body.errors);

    process.exit(0);
  } catch (err) {
    console.error('Elasticsearch sync error:', err);
    process.exit(1);
  }
}
