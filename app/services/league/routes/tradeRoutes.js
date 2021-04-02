/** @module routes/tradeRoutes */

const express = require('express');

const router = express.Router();

const tradeController = require('../controllers/tradeController');
const tradeValidation = require('../middleware/validate');

/**
 * Route handling order placement
 * @function
 * @name post/submit
 */
router.post('/submit', tradeValidation.authValidation, tradeValidation.findValidLeague, tradeValidation.validTicker, tradeController.trade);

module.exports = router;
