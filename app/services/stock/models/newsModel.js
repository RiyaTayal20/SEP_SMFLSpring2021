const mongoose = require('mongoose');

const { Schema } = mongoose;

const newsSchema = new Schema({
    tickerSymbol: {
        type: String,
        required: true,
    },
    articles: [{
        headline: {
            type: String,
            required: true,
        },
        summary: {
            type: String,
            required: true,
        },
        image: {
            type: String
        },
        url: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true
        },
    }],
    lastUpdated: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('News', newsSchema);