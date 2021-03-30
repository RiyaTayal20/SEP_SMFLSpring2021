const fetch = require('node-fetch');

const { Equity, Ticker } = require('../models/equityModel');

/**
 * Number of minutes that a stock is considered recent - won't update price unless longer than this
 * @constant
 * @type {number}
 */
const CACHE_TIME = 1;

/**
 * The time frames that are able to be searched for historical data
 * @constant
 * @type {Array<String>}
 */
const AVAILABLE_TIME_FRAMES = ['5d', '1m', '6m', 'ytd', '1y', '5y'];

/* eslint-disable no-return-assign, max-len, no-param-reassign, no-sequences */

/**
 * Format intraday price data into an object of <minute>:<average_price>
 * @function
 * @param {Array<Object>} priceArray Full price object from IEX cloud
 * @returns {Object} Average price for every minute
 */
const extractIntraday = (priceArray) => priceArray.reduce((obj, { minute, average }) => (obj[minute] = average, obj), {});

/**
 * Format historical price data into an object of <date>:<close_price>
 * @function
 * @param {Array<Object>} priceArray Full price object from IEX cloud
 * @returns {Object} Closing price for every day
 */
const extractHistorical = (priceArray) => priceArray.reduce((obj, { date, close }) => (obj[date] = close, obj), {});

/**
 * Get just the last available intraday price
 * @function
 * @param {Array<Object>} priceArray Full price object from IEX cloud
 * @returns {number} Last available intraday price
 */
const extractCurrent = (priceArray) => priceArray.slice(-1)[0].close;

/**
 * Get statistics from the specified equity and update cache
 * @async
 * @function
 * @param {String} ticker Ticker symbol for the specified equity
 * @returns {Object} The statistics for the equity
 */
const getStatistics = async (ticker) => {
    try {
        const equity = await Equity.findOne({ tickerSymbol: ticker });
        if (equity) {
            // check if equity was recently cached
            const currentTime = new Date();
            const timeDifference = (currentTime - equity.time) / 60000;
            if (timeDifference < CACHE_TIME) return equity;
        }

        // get equity statistics data from API
        const statsReponse = await fetch(`https://cloud.iexapis.com/stable/stock/${ticker}/stats?token=${process.env.API_KEY}`);
        const keyStats = await statsReponse.json();
        const quoteReponse = await fetch(`https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=${process.env.API_KEY}`);
        const equityQuote = await quoteReponse.json();

        // if not recently cached OR does not exist, add to database
        const savedEquity = await Equity.findOneAndUpdate(
            { tickerSymbol: ticker },
            {
                $set: {
                    // only save values we need
                    tickerSymbol: ticker,
                    equityName: keyStats.companyName,
                    currentPrice: equityQuote.latestPrice,
                    previousClose: equityQuote.previousClose,
                    openPrice: equityQuote.iexOpen,
                    marketCap: keyStats.marketcap,
                    peRatio: keyStats.peRatio,
                    beta: keyStats.beta,
                    bidPrice: equityQuote.iexBidPrice,
                    askPrice: equityQuote.iexAskPrice,
                    dayHigh: equityQuote.high,
                    dayLow: equityQuote.low,
                    week52High: keyStats.week52high,
                    week52Low: keyStats.week52low,
                    dividend: keyStats.dividendYield,
                    exDividend: keyStats.exDividendDate,
                    volume: equityQuote.iexVolume,
                    eps: keyStats.ttmEPS,
                    earningsDate: keyStats.nextEarningsDate,
                    percentChange: equityQuote.changePercent,
                    avgVolume: equityQuote.avgTotalVolume,
                    time: new Date(),
                },
            },
            {
                new: true,
                upsert: true,
            },
        );
        return savedEquity;
    } catch (err) {
        console.error(err);
        return err;
    }
};

/**
 * Get the intraday prices for the specified equity and update cache
 * @async
 * @function
 * @param {String} equityTicker The ticker symbol for the specified equity
 * @returns {Object} The intraday prices for every minute
 */
const getIntraday = async (equityTicker) => {
    try {
        const existingEntry = await Equity.findOne(
            { tickerSymbol: equityTicker },
        ).exec();
        if (existingEntry == null) {
            await getStatistics(equityTicker);
        } else if (existingEntry != null) {
            const currTime = new Date();
            // Calculate time difference in minutes
            const timeDiff = (currTime - existingEntry.intraday.lastUpdated) / (60 * 1000);
            // Recently queried, get cached price
            if (timeDiff < CACHE_TIME) {
                return existingEntry.intraday;
            }
        }
        const response = await fetch(`https://cloud.iexapis.com/stable/stock/${equityTicker}/intraday-prices?token=${process.env.API_KEY}`);
        const priceData = await response.json();
        // Save to database "cache"
        const updatedEquity = await Equity.findOneAndUpdate(
            { tickerSymbol: equityTicker },
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

/**
 * Get the historical price data for a specified equity and timeframe
 * @async
 * @function
 * @param {String} equityTicker The ticker for the specified equity
 * @param {String} timeFrame The timeframe to search, must be in: 5d, 1m, 6m, ytd, 1y, 5y
 * @returns {Object}
 */
const getHistorical = async (equityTicker, timeFrame) => {
    try {
        const existingEntry = await Equity.findOne(
            { tickerSymbol: equityTicker },
        ).exec();
        if (existingEntry == null) { // Populate statistics fields first
            await getStatistics(equityTicker);
        } else if (existingEntry != null && existingEntry[timeFrame] != null) {
            const currTime = new Date();
            // Calculate time difference in minutes
            const timeDiff = (currTime - existingEntry[timeFrame].lastUpdated) / (60 * 1000);
            // Recently queried, get cached price
            if (timeDiff < CACHE_TIME) {
                return existingEntry[timeFrame];
            }
        }
        const response = await fetch(`https://cloud.iexapis.com/stable/stock/${equityTicker}/chart/${timeFrame}/?chartCloseOnly=true&token=${process.env.API_KEY}`);
        const priceData = await response.json();
        // console.log(priceData);
        // Save to database "cache"
        const updatedEquity = await Equity.findOneAndUpdate(
            { tickerSymbol: equityTicker },
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

/**
 * Get the intraday prices
 * @async
 * @function
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
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

/**
 * Get the historical prices
 * @async
 * @function
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Object}
 */
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

/**
 * Get the current price
 * @async
 * @function
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
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

/**
 * Get a list of all tracked tickers
 * @async
 * @function
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
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

/**
 * Get the statistics of an equity
 * @async
 * @function
 * @param {Express.Request} request
 * @param {Express.Response} response
 */
exports.equityStatistics = async (request, response) => {
    const statistics = await getStatistics(request.params.ticker)
        .catch((err) => {
            console.error(err);
            response.status(400).send(err);
        });
    response.send(statistics);
};
