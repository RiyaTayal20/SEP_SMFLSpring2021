const express = require('express');

const router = express.Router();

const tooltipController = require('../controllers/tooltipController');

router.post('/save', tooltipController.scrapeWebsite);

router.get('/:term', tooltipController.getTooltip);

router.get('/', tooltipController.getTooltips);

module.exports = router;
