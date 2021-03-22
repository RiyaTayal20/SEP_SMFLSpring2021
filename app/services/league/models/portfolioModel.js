const mongoose = require('mongoose');
const orderModel = require('./orderModel');

const portfolioSchema = new mongoose.Schema({
    portfolioValue: {
        type: Number,
        required: true,
    },
    buyingPower: {
        type: Number,
        required: true,
    },
    child: orderModel.schema,
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
