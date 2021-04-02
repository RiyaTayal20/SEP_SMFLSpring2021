/** @module models/leagueModel */

const mongoose = require('mongoose');

const { portfolioSchema } = require('./portfolioModel');

/**
 * League containing settings, players, and portfolios
 * @constructor League
 */
const leagueSchema = new mongoose.Schema({
    leagueName: {
        type: String,
        required: true,
        max: 255,
        min: 3,
    },
    leagueManager: {
        type: String,
    },
    leagueKey: {
        type: String,
        default: '',
    },
    playerList: {
        type: Array,
        default: [],
    },
    portfolioList: [portfolioSchema],
    settings: {
        balance: {
            type: Number,
            default: 10000,
        },
        aiPlayer: {
            type: Number,
            default: 0,
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
            required: true,
        },
        maxPlayers: {
            type: Number,
            required: true,
        },
        public: {
            type: Boolean,
            default: false,
        },
        commissionPercent: {
            type: Number,
            default: 0,
        },
        tradeLimit: {
            type: Number,
            default: 0,
        },
        tradeHours: {
            start: {
                type: Number,
                default: -1,
            },
            end: {
                type: Number,
                default: -1,
            },
        },
    },
});

module.exports = mongoose.model('League', leagueSchema);
