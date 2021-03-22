const express = require('express');

const router = express.Router();

const leagueController = require('../controllers/leagueController');
const leagueValidation = require('../middleware/validate');
const leagueAuthorization = require('../middleware/auth');

router.post('/create', leagueValidation.authValidation, leagueValidation.leagueCreation, leagueController.createLeague);

router.post('/join', leagueValidation.authValidation, leagueValidation.findValidLeague, leagueAuthorization.authorizeLeague, leagueController.joinLeague);

router.post('/leave', leagueValidation.authValidation, leagueValidation.findValidLeague, leagueController.leaveLeague);

router.post('/disband', leagueValidation.authValidation, leagueValidation.findValidLeague, leagueController.disbandLeague);

router.get('/find', leagueController.getLeagues);

router.get('/names', leagueController.getLeagueNames);

router.get('/findleague', leagueController.getLeagueByName);

module.exports = router;