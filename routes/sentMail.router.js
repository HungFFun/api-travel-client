const express = require('express');
const router = express.Router();
const sentMailController = require('../controllers/sentMail.controller');

router.post('/api/sentEmail', sentMailController.sentEmailConfirm);

// api tour

module.exports = router;
