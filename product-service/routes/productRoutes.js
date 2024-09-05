const express = require('express');
const {addProduct,getProductbyId,deleteProduct,getMerchantProducts,getStock} = require('../controllers/productController');
const router = express.Router();
const upload = require('../config/multer');
const {isMerchant} = require("../middlewares/authMiddleware");


router.post('/addProduct',upload.array('images', 10),isMerchant,addProduct);
router.get('/product/:id',getProductbyId)
router.delete('/delete/:id',isMerchant,deleteProduct);
router.get('/myProducts',isMerchant,getMerchantProducts);
router.get('/stock/:productId',getStock)
module.exports = router;
