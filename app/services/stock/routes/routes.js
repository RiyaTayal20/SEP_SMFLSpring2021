const express = require('express');
const router = express.Router();

const equityController = require('../controllers/controller.js');

router.get('', (req, res, next) => {
    res.send('Welcome to stocks page');
});

router.get('/:ticker', equityController.equity);

module.exports = router;
