/** @module tasks/aiTask */

const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

const {spawn} = require('child_process');
const { getMarketPrice } = require('../../league/utils/stockUtils');

const sendTrade = async (token, leagueName, order, ticker, quantity) => fetch(`${process.env.LAPI_URL}/trade/submit`, {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        leagueName: leagueName,
        orderType: order,
        tickerSymbol: ticker,
        quantity: quantity,
        expiryDate: "",
        pricePerShare: "",
    }),
}).then((res) => {
    if (res.ok) {
        console.log(`Successfully sent trade order: ${order}`);
    }
}).catch((err) => {
    console.log(err);
});

const getLeagueName = async (id) => {
    const response = await fetch(`${process.env.LAPI_URL}/league/findid/${id}`, {
        method: 'GET',
    }).catch((err) => {
        console.log(err);
    });
    const data = await response.json()
    return data.leagueName;
};

const getAIPortfolio = async (token, leagueName) => {
    const response = await fetch(`${process.env.LAPI_URL}/league/portfolio/${leagueName}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }).catch((err) => {
        console.log(err);
    });
    return await response.json();
};

const tradeCheck = async (token, leagueName, portfolio, ratings) => {
    let buyStocks = ratings.map((e, i) => e === 'Buy' ? tickers[i] : '').filter(String);
    if (buyStocks.length != 0) {
        let ticker = buyStocks[Math.floor(Math.random() * buyStocks.length)].toLowerCase();
        let price = await getMarketPrice(ticker);
        let quantity = Math.floor(portfolio.cashAvailable/20/price.price);
        console.log(`buys ${quantity} shares of ${ticker}!`);
        if (quantity > 0) {
            sendTrade(token, leagueName, 'marketBuy', ticker, quantity);
        }
    }
    for (holding in portfolio.holdings) {
        let rating = ratings[tickers.indexOf(holding.toUpperCase())];
        if (rating === 'Sell') {
            console.log(`sells ${portfolio.holdings[holding].quantity} shares of ${holding}!`);
            sendTrade(token, leagueName, 'marketSell', holding.toUpperCase() , portfolio.holdings[holding].quantity);
        }
    }
};

const AIoperations = async () => {
    const response = await fetch(`${process.env.LAPI_URL}/user/ai`, {
        method: 'GET',
    }).catch((err) => {
        console.log(err);
    });
    const bots = await response.json();
    bots.forEach(async (bot) => {
        const body = { _id: bot._id, username: bot.username };
        const token = jwt.sign({ user: body }, `${process.env.JWT_KEY}`);
        const leagueID = bot.leagues[0];
        const leagueName = await getLeagueName(leagueID);        
        const portfolio = await getAIPortfolio(token, leagueName);
        if (bot.algorithm == 'mean') {
            console.log('mean trade');
            tradeCheck(token, leagueName, portfolio, meanRatings);
        }
        else if (bot.algorithm == 'momentum') {
            console.log('momentum trade');
            tradeCheck(token, leagueName, portfolio, momentumRatings);
        }
        else if (bot.algorithm == 'candlesticks') {

        }
    });
}

exports.aiBots = async () => {
    tickers = ['CNI', 'MO', 'TSLA','TDC', 'XM', 'EFX', 'JNJ', 'AAPL', 'SNBR', 'SEIC']
    tickers = tickers.map(function(x) { return x.toUpperCase(); })
    // make sure all tickers are in ticker database for trade to execute

    meanRatings = [];
    momentumRatings = [];
    candlestickRatings = [];

    const mean = spawn('python', ['algorithms/meanReversion.py']);

    mean.stdout.on('data', function (data) {
        let rating = data.toString().trim();
        rating = rating.replace( /[\r\n]+/gm, ' ');
        meanRatings = rating.split(' ');
        console.log(meanRatings);
    });

    mean.stderr.on('data', function (data){
        console.log(data.toString());
    });

    mean.on('close', (code) => {

    });

    const momentum = spawn('python', ['algorithms/momentum.py']);

    momentum.stdout.on('data', function (data) {
        let rating = data.toString().trim();
        rating = rating.replace( /[\r\n]+/gm, ' ');
        momentumRatings = rating.split(' ');
        console.log(momentumRatings);
    });

    momentum.stderr.on('data', function (data){
        console.log(data.toString());
    });

    momentum.on('close', (code) => {
        
    });


    const candlesticks = spawn('python', ['algorithms/candlesticks.py']);

    candlesticks.stdout.on('data', function (data) {
        let rating = data.toString().trim();
        rating = rating.replace( /[\r\n]+/gm, ' ');
        candlestickRatings = rating.split(' ');
        console.log(candlestickRatings);
    });

    candlesticks.stderr.on('data', function (data){
        console.log(data.toString());
    });

    candlesticks.on('close', (code) => {
        AIoperations();
    });
    
};
