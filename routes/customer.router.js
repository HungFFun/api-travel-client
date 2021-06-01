const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customer.controller')

// api customer
router.get('/api/customers',customerController.getAllCustomer);
router.get('/api/customer',customerController.getCustomerById);
router.put('/api/customer',customerController.updateCustomer);
router.put('/api/update-profile',customerController.updateCustomerByToken);
router.post('/api/customer/numberorder', customerController.getNumberOrder);

module.exports = router