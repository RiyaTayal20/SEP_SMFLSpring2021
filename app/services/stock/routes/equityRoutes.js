const express = require('express');

const router = express.Router();

const equityController = require('../controllers/equityController.js');

router.get('/statistics/:ticker', equityController.equity);

router.get('*', (request, response) => {
    response.send('This endpoint does not exist!');
});

module.exports = router;
