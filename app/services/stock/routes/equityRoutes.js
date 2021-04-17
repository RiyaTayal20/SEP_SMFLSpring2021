/** @module routes/equityRoutes */

const express = require('express');

const router = express.Router();

const equityController = require('../controllers/equityController');

/**
 * Route handling query of intraday data
 * @function
 * @name get/intraday/:equityTicker
 */
router.get('/intraday/:equityTicker/', equityController.equityIntraday);

/**
 * Route handling query of historical data
 * @function
 * @name get/historical/:equityTicker
 */
router.get('/historical/:equityTicker', equityController.equityHistorical);

/**
 * Route handling query of current price data
 * @function
 * @name get/current/:equityTicker
 */
router.get('/current/:equityTicker', equityController.equityCurrent);

/**
 * Route handling query of valid equity ticker
 * @function
 * @name get/tickers/:equityTicker
 */
router.get('/tickers/:equityTicker', equityController.equityTickers);

/**
 * Route handling query of equity statistics
 * @function
 * @name get/statistics/:ticker
 */
router.get('/statistics/:ticker', equityController.equityStatistics);

/**
 * Route handling unknown endpoints
 * @function
 * @name get/*
 */
router.get('*', (request, response) => {
    response.status(404).send('This endpoint does not exist!');
});

module.exports = router;
