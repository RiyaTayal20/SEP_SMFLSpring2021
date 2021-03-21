const express = require('express');
const passport = require('passport');

const router = express.Router();

const userController = require('../controllers/userController');
const userValidation = require('../middleware/validate');
require('../config/jwtConfig')(passport);

router.post('/register', userValidation.signup, userController.register);

router.post('/login', userController.login);

router.get('/find', userController.findUserById);

module.exports = router;
