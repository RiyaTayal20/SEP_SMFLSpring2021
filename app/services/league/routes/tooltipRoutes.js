const express = require('express');

const router = express.Router();

const tooltipController = require('../controllers/tooltipController');

router.get('/:term', tooltipController.getTooltip);

router.get('/', tooltipController.getTooltips);

module.exports = router;