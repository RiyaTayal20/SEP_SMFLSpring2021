const express = require('express');

const router = express.Router();

const stockController = require('../controllers/stockController');

router.get('/intraday/:equityTicker/', stockController.equityIntraday);

router.get('/historical/:equityTicker', stockController.equityHistorical);

router.get('/current/:equityTicker', stockController.equityCurrent);

router.get('*', (req, res) => {
    res.send('Endpoint does not exist');
});

module.exports = router;
