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
    oneday: {
        lastUpdated: Date,
        prices: Object,
    },
    fiveday: {
        lastUpdated: Date,
        prices: Object,
    },
    onemonth: {
        lastUpdated: Date,
        prices: Object,
    },
    sixmonth: {
        lastUpdated: Date,
        prices: Object,
    },
    yeartodate: {
        lastUpdated: Date,
        prices: Object,
    },
    oneyear: {
        lastUpdated: Date,
        prices: Object,
    },
    fiveyear: {
        lastUpdated: Date,
        prices: Object,
    },
});

module.exports = mongoose.model('Equity', EquitySchema);
