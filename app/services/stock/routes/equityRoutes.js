const express = require('express');
const router = express.Router();

const equityController = require('../controllers/equityController.js');

router.get('/:ticker', equityController.equity);

module.exports = router;
