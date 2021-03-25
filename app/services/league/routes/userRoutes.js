const express = require('express');
const passport = require('passport');

const router = express.Router();

const userController = require('../controllers/userController');
const userValidation = require('../middleware/validate');
require('../config/jwtConfig')(passport);

router.post('/register', userValidation.signup, userController.register);

router.post('/login', userController.login);

router.get('/find', userController.findUserById);

router.get('/:username/league', userController.getLeagueByUser);

module.exports = router;
