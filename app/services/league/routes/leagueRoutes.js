/** @module routes/leagueRoutes */

const express = require('express');

const router = express.Router();

const leagueController = require('../controllers/leagueController');
const leagueValidation = require('../middleware/validate');
const leagueAuthorization = require('../middleware/auth');

/**
 * Route handling creation of leagues
 * @function
 * @name post/create
 */
router.post('/create', leagueValidation.authValidation, leagueValidation.leagueCreation, leagueController.createLeague);

/**
 * Route handling user joining leagues
 * @function
 * @name post/join
 */
router.post('/join', leagueValidation.authValidation, leagueValidation.findValidLeague, leagueAuthorization.authorizeLeague, leagueController.joinLeague);

/**
 * Route handling user leaving leagues
 * @function
 * @name post/leave
 */
router.post('/leave', leagueValidation.authValidation, leagueValidation.findValidLeague, leagueController.leaveLeague);

/**
 * Route handling league manager disbanding league
 * @function
 * @name post/disband
 */
router.post('/disband', leagueValidation.authValidation, leagueValidation.findValidLeague, leagueController.disbandLeague);

/**
 * Route handling league manager kicking player from league
 * @function
 * @name post/kick
 */
 router.post('/:league/kick', leagueValidation.authValidation, leagueController.kickPlayer);

/**
 * Route handling query of all leagues
 * @function
 * @name get/find/all
 */
router.get('/find/all', leagueController.getLeagues);

/**
 * Route handling query of all league names
 * @function
 * @name get/find/names
 */
router.get('/find/names', leagueController.getLeagueNames);

/**
 * Route handling query of specified league name
 * @function
 * @name get/find/:leagueName
 */
// router.get('/find/:leagueName', leagueController.getLeagueByName);

/**
 * Route handling query of user's portfolio in specified league
 * @function
 * @name get/portfolio/:league
 */
router.get('/portfolio/:league', leagueValidation.authValidation, leagueController.getPortfolio);

router.get('/news/:league', leagueValidation.authValidation, leagueController.getPortfolioNews);

module.exports = router;
