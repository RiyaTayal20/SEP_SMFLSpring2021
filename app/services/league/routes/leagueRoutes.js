const express = require('express');

const router = express.Router();

const leagueController = require('../controllers/leagueController');
const leagueValidation = require('../middleware/validate');

router.post('/create', leagueValidation.leagueCreation, leagueController.createLeague);

router.post('/join', leagueController.joinLeague);

module.exports = router;
