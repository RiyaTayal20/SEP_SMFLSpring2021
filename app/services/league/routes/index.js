const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('This is the home page');
});

router.post('/user/signup', (req, res) => {
    res.send('Put response body here');
});

module.exports = router;