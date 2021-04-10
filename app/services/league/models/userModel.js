/** @module models/userModel */

const mongoose = require('mongoose');

/**
 * A user's credentials and leagues list
 * @constructor User
 */
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        max: 255,
        min: 3,
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 3,
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6,
    },
    leagues: {
        type: Array,
        default: [],
    },
    isBot: {
        type: Boolean,
        default: false
    },
    algorithm: {
        type: String,
    }
});

module.exports = mongoose.model('User', userSchema);
