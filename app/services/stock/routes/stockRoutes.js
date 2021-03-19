const express = require('express');

const router = express.Router();

const stockController = require('../controllers/stockController');

router.get('/:equityTicker', stockController.equity);

router.get('/', (req, res) => {
    console.log('Got this');
    res.send('Hey');
});

module.exports = router;
