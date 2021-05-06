const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');

router.post('/api/account/login', accountController.loginAccount);
router.post('/api/account/register', accountController.registerAccount);
router.post(
  '/api/account/login-google-or-facebook',
  accountController.loginFaceOrGoogle
);

router.get('/api/account/profile/:id', accountController.getUserId);
router.post('/api/account/profile', accountController.getUserByToken);

router.put('/api/account/status/:id', accountController.updateStatusAccount);
router.put('/api/account/changePass/:id', accountController.updatePasword);

module.exports = router;
