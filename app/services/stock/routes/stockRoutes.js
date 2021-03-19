const express = require('express');

const router = express.Router();

const stockController = require('../controllers/stockController');

router.get('/intraday/:equityTicker/', stockController.equityIntraday);

router.get('/historical/:equityTicker', stockController.equityHistorical);

module.exports = router;
