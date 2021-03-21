const express = require('express');

const router = express.Router();

const leagueController = require('../controllers/leagueController');
const leagueValidation = require('../middleware/validate');

router.post('/create', leagueValidation.authValidation, leagueValidation.leagueCreation, leagueController.createLeague);

router.post('/join', leagueValidation.authValidation, leagueValidation.findValidLeague, leagueController.authorizeLeague, leagueController.joinLeague);

router.post('/leave', leagueValidation.authValidation, leagueValidation.findValidLeague, leagueController.leaveLeague);

router.post('/disband', leagueValidation.authValidation, leagueValidation.findValidLeague, leagueController.disbandLeague);

module.exports = router;
