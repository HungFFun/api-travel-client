const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customer.controller')

// api customer
router.get('/api/customers',customerController.getAllCustomer);
router.get('/api/customer',customerController.getCustomerById);
router.put('/api/customer',customerController.updateCustomer);

module.exports = router