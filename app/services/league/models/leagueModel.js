const mongoose = require('mongoose');

//https://mongoosejs.com/docs/schematypes.html#dates

const leagueSchema = new mongoose.Schema({
    leagueName: {
        type: String,
        required: true,
        max: 255,
        min: 3,
    },
    leagueID: {
        type: Number,
        required: true,
    },
    leagueManager: {
        type: String,
        required: true,
    },
    settings: [{
        aiPlayer: {
            type: Number,
            required: true
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
            required: true
        },
        maxPlayers: {
            type: Number,
            required: true
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
        tradeHours: [{
            start: {
                type: Number,
                default: -1,
            },
            end: {
                type: Number,
                default: -1,
            },
        }],
    }],
});