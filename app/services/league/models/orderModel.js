const mongoose = require('mongoose');

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
});

module.exports = mongoose.model('Order', orderSchema);
