const express = require('express')
const router = express.Router()
const paymentController = require('../controllers/payment.controller')

router.post('/api/payment/pay',paymentController.payment);

module.exports = router