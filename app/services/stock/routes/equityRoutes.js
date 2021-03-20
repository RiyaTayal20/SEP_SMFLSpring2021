const express = require('express');
const router = express.Router();
const equityController = require('../controllers/equityController.js');

router.get('/statistics/:ticker', equityController.equity);

module.exports = router;
