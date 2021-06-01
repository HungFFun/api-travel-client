const express = require('express');
const router = express.Router();
const sentMailController = require('../controllers/sentMail.controller');

router.post('/api/sentEmail', sentMailController.sentEmailConfirm);
router.post('/api/sentEmail-changePass', sentMailController.sentEmailChangePass);

// api tour

module.exports = router;
