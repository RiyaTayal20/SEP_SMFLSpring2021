const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderType: {
        type: String,
        required: true,
    },
    equityName: {
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
    },
    quantity: {
        type: Number,
        required: true,
    },
    pricePerShare: {
        type: Number,
        required: true,
    },
    executed: {
        type: Boolean,
        required: true,
    }
});

module.exports = mongoose.model('Order', orderSchema);