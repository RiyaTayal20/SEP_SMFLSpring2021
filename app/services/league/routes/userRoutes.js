const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const userValidation = require('../middleware/validation/auth');

router.post('/register', userValidation.signup, userController.register);

router.get('/profile', userController.profile);

module.exports = router;
