const mongoose = require('mongoose');

const { Schema } = mongoose;

const EquitySchema = new Schema({
    tickerSymbol: {
        type: String,
        required: true,
        unique: true,
    },
    equityName: {
        type: String,
        required: true,
    },
    currentPrice: {
        type: Number,
        required: true,
    },
    previousClose: {
        type: Number,
        required: true,
    },
    openPrice: {
        type: Number,
    },
    marketCap: {
        type: Number,
        required: true,
    },
    peRatio: {
        type: Number,
        default: 0,
    },
    beta: {
        type: Number,
    },
    bidPrice: {
        type: Number,
        required: true,
    },
    askPrice: {
        type: Number,
        required: true,
    },
    dayHigh: {
        type: Number,
    },
    dayLow: {
        type: Number,
    },
    week52High: {
        type: Number,
    },
    week52Low: {
        type: Number,
    },
    dividend: {
        type: Number,
        default: 0,
    },
    exDividend: {
        type: Date,
    },
    volume: {
        type: Number,
        required: true,
    },
    avgVolume: {
        type: Number,
        required: true,
    },
    eps: {
        type: Number,
    },
    earningsDate: {
        type: Date,
    },
    percentChange: {
        type: Number,
        required: true,
    },
    time: {
        type: Date,
        default: Date.now,
    },
    /*
    news: [{
        headline: {
            type: String,
            required: true,
        },
        image: {
            type: String
        },
        date: {
            type: Date,
            required: true
        }
    }]
    */
    intraday: {
        lastUpdated: Date,
        prices: Object,
    },
    '5d': {
        lastUpdated: Date,
        prices: Object,
    },
    '1m': {
        lastUpdated: Date,
        prices: Object,
    },
    '6m': {
        lastUpdated: Date,
        prices: Object,
    },
    ytd: {
        lastUpdated: Date,
        prices: Object,
    },
    '1y': {
        lastUpdated: Date,
        prices: Object,
    },
    '5y': {
        lastUpdated: Date,
        prices: Object,
    },
});

const TickerSchema = new Schema({
    ticker: {
        type: String,
        unique: true,
        required: true,
    },
});

module.exports = {
    Equity: mongoose.model('Equity', EquitySchema),
    Ticker: mongoose.model('Ticker', TickerSchema),
};
