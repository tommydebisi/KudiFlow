const express = require('express');
const router = express.Router();
const authToken = require('../middlewares/authToken');
const AuthController = require('../controllers/authController');

router.route('/register').post(AuthController.signUp);
router.route('/login').get(AuthController.signIn);
router.route('/logout').get(authToken, AuthController.logout);
router.route('/token').get(AuthController.getNewToken);

module.exports = router;
