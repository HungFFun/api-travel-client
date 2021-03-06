const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');

router.post('/api/account/login', accountController.loginAccount);
router.post('/api/account/register', accountController.registerAccount);
router.post(
  '/api/account/login-google-or-facebook',
  accountController.loginFaceOrGoogle
);

router.get('/api/account/profileByUserId', accountController.getUserId);
router.post('/api/account/profileByToken', accountController.getUserByToken);

router.put('/api/account/status', accountController.updateStatusAccount);
router.put('/api/account/changePass', accountController.updatePasswordByToken);
router.put('/api/account/back-password', accountController.changePassword);


module.exports = router;
