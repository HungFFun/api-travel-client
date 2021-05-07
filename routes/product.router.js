const express = require('express')
const router = express.Router()
const productController = require('../controllers/product.controller')

// api product
router.get('/api/products',productController.getAllProduct);
router.get('/api/product',productController.getProductById);
// get product qua type
router.post('/api/productByType',productController.getProductByType);


module.exports = router