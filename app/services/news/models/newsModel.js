const mongoose = require('mongoose');

const { Schema } = mongoose;

const newsSchema = new Schema({
    headline: {
        type: String,
        requird: true,
    },
    image: {
        type: String
    },
    url: {
        type: String,
        required: true,
    },
    date: {
        type: date,
        required: true
    },
});

module.exports = mongoose.model('News', newsSchema);