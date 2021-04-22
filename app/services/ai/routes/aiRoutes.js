/** @module routes/aiRoutes */

const express = require('express');

const router = express.Router();

const aiController = require('../controllers/aiController');

/**
 * Route handling query of mean reversion graph data
 * @function
 * @name get/mean/:ticker
 */
 router.get('/mean/:ticker', aiController.mean);
 
 /**
 * Route handling query of close prices over the past year
 * @function
 * @name get/close/:ticker
 */
  router.get('/close/:ticker', aiController.close);

 /**
 * Route handling query of momentum graph data
 * @function
 * @name get/momentum/:ticker
 */
router.get('/momentum/:ticker', aiController.momentum);

/**
 * Route handling query of momentum graph data
 * @function
 * @name get/candlesticks/:ticker
 */
 router.get('/candlesticks/:ticker', aiController.candlesticks);

 /**
 * Route handling all other queries
 * @function
 * @name get/
 */
 router.get('*', (req, res) => {
    res.status(404).send('This endpoint does not exist!');
});

 module.exports = router;