const app = require('./server');
const fetch = require('node-fetch');
const {spawn} = require('child_process');

const PORT = process.env.PORT || 3005;

require('dotenv').config();

const User = require('../league/models/userModel');
const jwt = require('jsonwebtoken');

tickers = ['SPCE', 'QS', 'PLUG', 'TV', 'BBBY'];
meanRatings = [];
momentumRatings = [];
candlestickRatings = [];

const mean = spawn('python', ['algorithms/meanReversion.py']);
const momentum = spawn('python', ['algorithms/momentum.py']);

const sendTrade = async (token, leagueName, order) => fetch(`${process.env.LAPI_URL}/trade/submit`, {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        leagueName: leagueName,
        orderType: order,
        tickerSymbol: "AAPL",
        quantity: 1,
        expiryDate: "",
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
}

const tradeCheck = async () => {
    const response = await fetch(`${process.env.LAPI_URL}/user/ai`, {
        method: 'GET',
    });
    const bots = await response.json();
    bots.forEach(async (bot) => {
        const body = { _id: bot._id, username: bot.username };
        const token = jwt.sign({ user: body }, `${process.env.JWT_KEY}`);
        const leagueID = bot.leagues[0];
        const leagueName = await getLeagueName(leagueID);
        if (bot.algorithm == 'mean') {
            var indices = meanRatings.map((e, i) => e === 'Buy' ? tickers[i] : '').filter(String);
            const ticker = indices[Math.floor(Math.random() * indices.length)];
            console.log(ticker);
            // sendTrade(token, leagueName, 'marketBuy');
        }
        else if (bot.algorithm == 'momentum') {

        }
        else if (bot.algorithm == 'candlesticks') {

        }
    });
};

mean.stdout.on('data', function (data) {
    rating = data.toString().trim();
    rating = rating.replace( /[\r\n]+/gm, ' ');
    meanRatings = rating.split(' ');
    console.log(meanRatings);
});

momentum.stdout.on('data', function (data) {
    rating = data.toString().trim();
    rating = rating.replace( /[\r\n]+/gm, ' ');
    momentumRatings = rating.split(' ');
    console.log(momentumRatings);
});

mean.on('close', (code) => {

});

momentum.on('close', (code) => {
    tradeCheck();
});


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));