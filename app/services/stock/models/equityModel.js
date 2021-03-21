const mongoose = require('mongoose');

const { Schema } = mongoose;

const EquitySchema = new Schema({
    ticker: {
        type: String,
        unique: true,
    },
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

module.exports = mongoose.model('Equity', EquitySchema);
