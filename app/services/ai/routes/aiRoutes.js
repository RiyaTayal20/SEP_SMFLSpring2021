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

 router.get('*', (req, res) => {
    res.status(404).send('This endpoint does not exist!');
});

 module.exports = router;