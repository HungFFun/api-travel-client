const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customer.controller')

// api customer
router.get('/api/customers',customerController.getAllCustomer);
router.get('/api/customer/:id',customerController.getCustomerById);
router.post('/api/customer',customerController.addCustomer);
router.put('/api/customer/:id',customerController.updateCustomer);
router.delete('/api/customer/:id',customerController.deleteCustomer);

module.exports = router