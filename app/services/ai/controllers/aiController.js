/** @module controllers/aiController */

const fetch = require('node-fetch');

exports.mean = async (req, res) => {
    console.log('mean');
    res.send(req.params.ticker);
};