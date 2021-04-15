/** @module routes/userRoutes */

const express = require('express');
const passport = require('passport');

const router = express.Router();

const userController = require('../controllers/userController');
const userValidation = require('../middleware/validate');
require('../config/jwtConfig')(passport);

/**
 * Route handling user registration
 * @function
 * @name post/register
 */
router.post('/register', userValidation.signup, userController.register);

/**
 * Route handling user login
 * @function
 * @name post/login
 */
router.post('/login', userController.login);

/**
 * Route handling query for user
 * @function
 * @name get/find
 */
// router.get('/find', userController.findUserById);

/**
 * Route handling query of user leagues
 * @function
 * @name get/:username/league
 */
router.get('/:username/league', userController.getLeagueByUser);

/**
 * Route handling query of ai bots
 * @function
 * @name get/ai
 */
 router.get('/ai', userController.getAI);

module.exports = router;
