const express = require('express');

const router = express.Router();

const leagueController = require('../controllers/leagueController');
const leagueValidation = require('../middleware/validate');

router.post('/create', leagueValidation.authValidation, leagueValidation.leagueCreation, leagueController.createLeague);

router.post('/join', leagueValidation.authValidation, leagueValidation.joinLeague, leagueController.joinLeague);

module.exports = router;
