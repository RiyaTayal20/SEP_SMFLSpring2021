const fetch = require('node-fetch');

const Equity = require('../models/equityModel');

// Number of minutes that a stock is considered recent - won't update price unless longer than this
const CACHE_TIME = 10;

const getIntraday = async (equityTicker) => {
    try {
        const existingEntry = await Equity.findOne(
            { ticker: equityTicker },
        ).exec();
        if (existingEntry != null) {
            const currTime = new Date();
            // Calculate time difference in minutes
            const timeDiff = (currTime - existingEntry.intraday.lastUpdated) / (60 * 1000);
            // Recently queried, get cached price
            if (timeDiff < CACHE_TIME) {
                return existingEntry;
            }
        }
        const response = await fetch(`https://cloud.iexapis.com/stable/stock/${equityTicker}/intraday-prices?token=${process.env.IEX_TOKEN}`);
        const priceData = await response.json();
        // Save to database "cache"
        const updatedEquity = await Equity.findOneAndUpdate(
            { ticker: equityTicker },
            { $set: { 'intraday.prices': priceData }, $currentDate: { 'intraday.lastUpdated': true } },
            {
                new: true,
                upsert: true,
            },
        );
        return updatedEquity;
    } catch (err) {
        console.error(err);
    }
};

exports.equity = async (req, res) => {
    const ticker = req.params.equityTicker;
    console.log(`${ticker} intraday prices requested`);
    getIntraday(ticker).then(res.send.bind(res));
};
