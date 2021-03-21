const fetch = require('node-fetch');

const { Equity, Ticker } = require('../models/equityModel');

// Number of minutes that a stock is considered recent - won't update price unless longer than this
const CACHE_TIME = 1;
const AVAILABLE_TIME_FRAMES = ['5d', '1m', '6m', 'ytd', '1y', '5y'];

// Format intraday price data into an object of <minute>:<average_price>
// eslint-disable-next-line no-return-assign, max-len, no-param-reassign, no-sequences
const extractIntraday = (priceArray) => priceArray.reduce((obj, { minute, average }) => (obj[minute] = average, obj), {});

// Format historical price data into an object of <date>:<close_price>
// eslint-disable-next-line no-return-assign, max-len, no-param-reassign, no-sequences
const extractHistorical = (priceArray) => priceArray.reduce((obj, { date, close }) => (obj[date] = close, obj), {});

// Get just the last available intraday price
const extractCurrent = (priceArray) => priceArray.slice(-1)[0].close;

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
                return existingEntry.intraday;
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
        return updatedEquity.intraday;
    } catch (err) {
        return Promise.reject(new Error('Unable to gather prices from IEX Cloud'));
    }
};

// Get historical price data
// Available time frames: 5d, 1m, 6m, ytd, 1y, 5y
const getHistorical = async (equityTicker, timeFrame) => {
    try {
        const existingEntry = await Equity.findOne(
            { ticker: equityTicker },
        ).exec();
        if (existingEntry != null && existingEntry[timeFrame] != null) {
            const currTime = new Date();
            // Calculate time difference in minutes
            const timeDiff = (currTime - existingEntry[timeFrame].lastUpdated) / (60 * 1000);
            // Recently queried, get cached price
            if (timeDiff < CACHE_TIME) {
                return existingEntry[timeFrame];
            }
        }
        const response = await fetch(`https://cloud.iexapis.com/stable/stock/${equityTicker}/chart/${timeFrame}/?chartCloseOnly=true&token=${process.env.IEX_TOKEN}`);
        const priceData = await response.json();
        // console.log(priceData);
        // Save to database "cache"
        const updatedEquity = await Equity.findOneAndUpdate(
            { ticker: equityTicker },
            { $set: { [`${timeFrame}.prices`]: priceData }, $currentDate: { [`${timeFrame}.lastUpdated`]: true } },
            {
                new: true,
                upsert: true,
            },
        );
        return updatedEquity[timeFrame];
    } catch (err) {
        return Promise.reject(new Error('Unable to gather prices from IEX Cloud'));
    }
};

exports.equityIntraday = async (req, res) => {
    const { equityTicker } = req.params;
    console.log(`${equityTicker} intraday prices requested`);
    // eslint-disable-next-line max-len
    const intraday = await getIntraday(equityTicker)
        .then((intradayStockData) => extractIntraday(intradayStockData.prices))
        .catch((err) => {
            console.error(err);
            res.status(400).json({ error: err.message });
        });
    res.send(intraday);
};

exports.equityHistorical = async (req, res) => {
    const { equityTicker } = req.params;
    const { timeframe } = req.query;
    if (!AVAILABLE_TIME_FRAMES.includes(timeframe)) {
        res.send('Invalid time frame');
        return;
    }
    console.log(`${equityTicker} ${timeframe} historical prices requested`);
    // eslint-disable-next-line max-len
    const historical = await getHistorical(equityTicker, timeframe)
        .then((historicalStockData) => extractHistorical(historicalStockData.prices))
        .catch((err) => {
            console.error(err);
            res.status(400).json({ error: err.message });
        });
    res.send(historical);
};

exports.equityCurrent = async (req, res) => {
    const { equityTicker } = req.params;
    console.log(`${equityTicker} current prices requested`);
    // eslint-disable-next-line max-len
    const current = await getIntraday(equityTicker)
        .then((intradayStockData) => extractCurrent(intradayStockData.prices))
        .catch((err) => {
            console.error(err);
            res.status(400).json({ error: err.message });
        });
    res.send({ price: current });
};

exports.equityTickers = async (req, res) => {
    const { equityTicker } = req.params;
    console.log(`Checking if ${equityTicker.toUpperCase()} is a valid ticker`);
    await Ticker.countDocuments({ ticker: equityTicker.toUpperCase() }, (err, count) => {
        if (err) {
            res.status(503).json({ error: 'Unable to access database' });
        } else if (count !== 0) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    });
};
