const express = require('express');

const router = express.Router();

const newsController = require('../controllers/newsController.js');

router.get('/newsInfo/:ticker', newsController.news);
router.get('*', (request, response) => {
    response.status(404).send('This endpoint does not exist!');
});

module.exports = router;