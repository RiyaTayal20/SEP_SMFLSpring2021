const mongoose = require('mongoose');
const fetch = require('node-fetch');

const { Ticker } = require('../models/equityModel');

require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false,
        });
        console.log('Successfully connected to database');
    } catch (err) {
        console.error('Failed to connect to database');
    }
};

const gatherTickers = async () => {
    const response = await fetch(`https://cloud.iexapis.com/stable/ref-data/iex/symbols?token=${process.env.API_KEY}`);
    const tickerList = await response.json();
    await tickerList.forEach((element) => {
        const insertTicker = new Ticker({ ticker: element.symbol });
        insertTicker.save();
    });
};

connectDB().then(gatherTickers());
