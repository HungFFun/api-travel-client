const express = require('express')
const router = express.Router()
const orderController = require('../controllers/order.controller')

// api place
router.get('/api/orders',orderController.getAllOrder);
router.post('/api/order/create',orderController.createOrderForCustomer);

module.exports = router