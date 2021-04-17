/** @module models/portfolioModel */

const mongoose = require('mongoose');

/**
 * Trade order
 * @constructor Order
 */
const orderSchema = new mongoose.Schema({
    orderType: {
        type: String,
        required: true,
    },
    portfolioId: {
        type: String,
        required: true,
    },
    tickerSymbol: {
        type: String,
        required: true,
    },
    timePlaced: {
        type: Date,
        required: true,
        default: Date.now,
    },
    quantity: {
        type: Number,
        required: true,
    },
    pricePerShare: {
        type: Number,
        required: true,
    },
    expiryDate: {
        type: Date,
    },
    executed: {
        type: Boolean,
        required: true,
    },
    activeLimitOrder: {
        type: Boolean,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
});

/**
 * Stores a player's holdings
 * @constructor Portfolio
 */
const portfolioSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true,
    },
    league: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'League',
        required: true,
    },
    cash: {
        type: Number,
        required: true,
    },
    currentNetWorth: {
        type: Number,
        required: true,
    },
    closePercentChange: {
        type: Number,
    },
    netWorth: [{
        date: Date,
        worth: Number,
    }],
    currentHoldings: [{
        ticker: String,
        quantity: Number,
    }],
    orders: [orderSchema],
});

module.exports = {
    Order: mongoose.model('Order', orderSchema),
    Portfolio: mongoose.model('Portfolio', portfolioSchema),
    portfolioSchema,
};
