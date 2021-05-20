const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.post('/api/payment/create', paymentController.create_payment_url);
router.get('/api/payment/get', paymentController.vnpay_ipn);

module.exports = router;
