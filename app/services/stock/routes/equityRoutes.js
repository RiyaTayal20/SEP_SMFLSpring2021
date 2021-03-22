const express = require('express');

const router = express.Router();

const equityController = require('../controllers/equityController');

router.get('/intraday/:equityTicker/', equityController.equityIntraday);

router.get('/historical/:equityTicker', equityController.equityHistorical);

router.get('/current/:equityTicker', equityController.equityCurrent);

router.get('/tickers/:equityTicker', equityController.equityTickers);

router.get('/statistics/:ticker', equityController.equityStatistics);

router.get('*', (request, response) => {
    response.send('This endpoint does not exist!');
});

module.exports = router;
