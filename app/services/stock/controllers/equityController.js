const fetch = require('node-fetch');
const Equity = require("../models/equityModel.js");
require('dotenv').config();

const CACHE_TIME = 1;

const getStatistics = async (ticker) => {
    const equity = await Equity.findOne({tickerSymbol: ticker});
    if (equity){
        //check if equity was recently cached
        const currentTime = new Date();
        const timeDifference = (currentTime - equity.time) / 60000;
        if (timeDifference < CACHE_TIME)
            return equity; 
    }

    //get equity statistics data from API
    const statsReponse = await fetch('https://cloud.iexapis.com/stable/stock/' + ticker + '/stats?token=' + process.env.API_KEY);
    const key_Stats = await statsReponse.json();
    const quoteReponse = await fetch('https://cloud.iexapis.com/stable/stock/' + ticker + '/quote?token=' + process.env.API_KEY);
    const equity_Quote = await quoteReponse.json();
    try {
        //if not recently cached OR does not exist, add to database
        const savedEquity = await Equity.findOneAndUpdate( {tickerSymbol: ticker}, 
            { $set: { 
                // only save values we need
                tickerSymbol: ticker,
                equityName: key_Stats.companyName,
                currentPrice: equity_Quote.latestPrice,
                previousClose: equity_Quote.previousClose,
                openPrice: equity_Quote.open,
                marketCap: key_Stats.marketcap,
                peRatio: key_Stats.peRatio,
                beta: key_Stats.beta,
                bidPrice: equity_Quote.iexBidPrice,
                askPrice: equity_Quote.iexAskPrice,
                dayHigh: equity_Quote.high,
                dayLow: equity_Quote.low,
                week52High: key_Stats.week52high,
                week52Low: key_Stats.week52low,
                dividend: key_Stats.dividendYield,
                exDividend: key_Stats.exDividendDate,
                volume: equity_Quote.iexVolume, 
                eps: key_Stats.ttmEPS,
                earningsDate: key_Stats.nextEarningsDate,
                percentChange: equity_Quote.changePercent,
                avgVolume: equity_Quote.avgTotalVolume, 
                time: new Date() }
            },
            {
                new: true,
                upsert: true,
            },
        );
        return savedEquity; 
    } catch (err) {
        console.log(err);
    }
};

exports.equity = async (request, response) => {
    getStatistics(request.params.ticker).then(response.send.bind(response));
};
