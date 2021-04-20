const app = require('./server');
const fetch = require('node-fetch');
const {spawn} = require('child_process');

const PORT = process.env.PORT || 3005;

require('dotenv').config();

const jwt = require('jsonwebtoken');
const { getMarketPrice } = require('../league/utils/stockUtils');

tickers = ['EDIT', 'SPCE', 'HMBL', 'PCRX', 'TV']; 
tickers = tickers.map(function(x) { return x.toUpperCase(); })
// make sure all tickers are in ticker database for trade to execute

meanRatings = [];
momentumRatings = [];
candlestickRatings = [];

const mean = spawn('python', ['algorithms/meanReversion.py']);
const momentum = spawn('python', ['algorithms/momentum.py']);

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
        console.log('Successfully sent trade order');
    }
}).catch((err) => {
    console.log(err);
});

const getLeagueName = async (id) => {
    const response = await fetch(`${process.env.LAPI_URL}/league/find/${id}`, {
        method: 'GET',
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
    });
    return await response.json();
};

const tradeCheck = async (token, leagueName, portfolio, ratings) => {
    let buyStocks = ratings.map((e, i) => e === 'Buy' ? tickers[i] : '').filter(String);
    if (buyStocks.length != 0) {
        let ticker = buyStocks[Math.floor(Math.random() * buyStocks.length)].toLowerCase();
        let price = await getMarketPrice(ticker);
        console.log(ticker);
        let quantity = Math.floor(portfolio.cashAvailable/8/price.price);
        console.log(quantity);
        if (quantity > 0) {
            // sendTrade(token, leagueName, 'marketBuy', ticker, quantity);
        }
    }
    for (holding in portfolio.holdings) {
        let rating = ratings[tickers.indexOf(holding.toUpperCase())];
        if (rating === 'Sell') {
            console.log(portfolio.holdings[holding].quantity);
            // sendTrade(token, leagueName, 'marketSell', holding.toUpperCase() , portfolio.holdings[holding].quantity);
        }
    }
};

const AIoperations = async () => {
    const response = await fetch(`${process.env.LAPI_URL}/user/ai`, {
        method: 'GET',
    });
    const bots = await response.json();
    bots.forEach(async (bot) => {
        const body = { _id: bot._id, username: bot.username };
        const token = jwt.sign({ user: body }, `${process.env.JWT_KEY}`);
        const leagueID = bot.leagues[0];
        const leagueName = await getLeagueName(leagueID);        
        const portfolio = await getAIPortfolio(token, leagueName);
        if (bot.algorithm == 'mean') {
            tradeCheck(token, leagueName, portfolio, meanRatings);
            /*
            let buyStocks = meanRatings.map((e, i) => e === 'Buy' ? tickers[i] : '').filter(String);
            if (buyStocks.length != 0) {
                let ticker = buyStocks[Math.floor(Math.random() * buyStocks.length)].toLowerCase();
                let price = await getMarketPrice(ticker);
                let quantity = Math.floor(portfolio.cashAvailable/6/price.price);
                if (quantity != 0)
                    sendTrade(token, leagueName, 'marketBuy', ticker, quantity);
            }
            for (holding in portfolio.holdings) {
                let rating = meanRatings[tickers.indexOf(holding.toUpperCase())];
                if (rating === 'Sell') {
                    // sendTrade(token, leagueName, 'marketSell', holding.toUpperCase() , portfolio.holdings[holding].quantity);
                }
            }
            */
        }
        else if (bot.algorithm == 'momentum') {
            tradeCheck(token, leagueName, portfolio, momentumRatings);
        }
        else if (bot.algorithm == 'candlesticks') {

        }
    });
};

mean.stdout.on('data', function (data) {
    let rating = data.toString().trim();
    rating = rating.replace( /[\r\n]+/gm, ' ');
    meanRatings = rating.split(' ');
    console.log(meanRatings);
});

momentum.stdout.on('data', function (data) {
    let rating = data.toString().trim();
    rating = rating.replace( /[\r\n]+/gm, ' ');
    momentumRatings = rating.split(' ');
    console.log(momentumRatings);
});

mean.on('close', (code) => {

});

momentum.on('close', (code) => {
    AIoperations();
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
