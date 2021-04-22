const mongoose = require('mongoose');

const tooltipSchema = new mongoose.Schema({
    term: {
        type: String,
        required: true,
    },
    definition: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Tooltip', tooltipSchema);
