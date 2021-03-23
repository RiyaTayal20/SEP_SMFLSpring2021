const fetch = require('node-fetch');

const { Order, Portfolio } = require('../models/portfolioModel');
const League = require('../models/leagueModel');

const MARKET_ORDERS = ['marketBuy', 'marketSell'];

const getMarketPrice = async (ticker) => {
    try {
        const currPrice = await fetch(`${process.env.STOCK_URL}/equity/current/${ticker}`);
        return currPrice;
    } catch (err) {
        console.error(err);
    }
};

exports.trade = async (req, res) => {
    try {
        let order;
        let userPortfolio;
        let currPrice;
        const { username } = res.locals;
        const selectedLeague = await League.findOne(
            { leagueName: req.body.leagueName },
            (err) => {
                if (err) throw err;
            },
        );
        // Define user portfolio
        selectedLeague.portfolioList.forEach((portfolio) => {
            if (portfolio.owner === username) {
                userPortfolio = portfolio;
            }
        });
        if (MARKET_ORDERS.includes(req.body.orderType)) { // Market order
            await getMarketPrice(req.body.tickerSymbol)
                .then((response) => response.json())
                .then((data) => {
                    currPrice = data.price;
                })
                .catch((err) => console.error(err));
            // Check that user has cash for this purchase
            if (userPortfolio.cash < currPrice * req.body.quantity) {
                throw Error('Insufficient cash for transaction');
            }
            order = new Order({
                orderType: req.body.orderType,
                portfolioId: userPortfolio._id,
                tickerSymbol: req.body.tickerSymbol,
                quantity: req.body.quantity,
                pricePerShare: currPrice || req.body.pricePerShare,
                expiryDate: req.body.expiryDate, // Maybe add function to handle common intervals
                executed: false,
                activeLimitOrder: false,
                totalPrice: currPrice * req.body.quantity,
            });
        } else { // Limit order: DEMO #2
            order = new Order({
                orderType: req.body.orderType,
                portfolioId: req.body.portfolioId,
                tickerSymbol: req.body.tickerSymbol,
                quantity: req.body.quantity,
                pricePerShare: req.body.pricePerShare,
                expiryDate: req.body.expiryDate, // Maybe add function to handle common intervals
                executed: false,
                activeLimitOrder: true,
            });
        }
        // Add order to portfolio
        await League.findOneAndUpdate(
            { _id: selectedLeague._id, 'portfolioList.owner': username },
            { $addToSet: { 'portfolioList.$.orders': order } },
            {
                upsert: true,
                new: true,
            },
            (err) => {
                if (err) throw err;
            },
        );
        selectedLeague.portfolioList.forEach((portfolio) => {
            if (portfolio.owner === username) {
                res.send(portfolio);
            }
        });
    } catch (err) {
        res.status(400).send(err);
    }
};
