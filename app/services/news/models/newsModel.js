const mongoose = require('mongoose');

const { Schema } = mongoose;

const newsSchema = new Schema({
    headline: {
        type: String,
        requird: true,
    },
    url: {
        type: String,
        required: true,
    },
    date: {
        type: date,
    },
});

module.exports = mongoose.model('News', newsSchema);