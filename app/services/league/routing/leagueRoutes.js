const express = require('express');

const router = express.Router();

const leagueController = require('../controllers/leagueController');

router.post('/create', leagueController.createLeague);

modules.exports = router;