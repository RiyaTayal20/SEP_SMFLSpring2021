const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const userValidation = require('../middleware/validate');

router.post('/register', userValidation.signup, userController.register);

router.post('/login', userController.login);

router.get('/', userController.profile);

module.exports = router;
