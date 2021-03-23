const fetch = require('node-fetch');

const { Order, Portfolio } = require('../models/portfolioModel');

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
        if (!MARKET_ORDERS.includes(req.body.orderType)) { // Market order
            const currPrice = await getMarketPrice(req.body.tickerSymbol);
            // Check that user has cash for this purchase
            const userPortfolio = await Portfolio.findById(
                req.body.portfolioId, // Not sure how it's formatted
                (err) => {
                    if (err) throw err;
                },
            );
            if (userPortfolio.cash < currPrice * req.body.quantity) {
                throw Error('Insufficient cash for transaction');
            }
            order = new Order({
                orderType: req.body.orderType,
                portfolioId: req.body.portfolioId, // Not sure how it's formatted
                tickerSymbol: req.body.tickerSymbol,
                quantity: req.body.quantity,
                pricePerShare: currPrice || req.body.pricePerShare,
                expiryDate: req.body.expiryDate, // Maybe add function to handle common intervals
                executed: false,
                activeLimitOrder: false,
            });
        } else { // Limit order
            order = new Order({
                orderType: req.body.orderType,
                portfolioId: req.body.portfolioId, // Not sure how it's formatted
                tickerSymbol: req.body.tickerSymbol,
                quantity: req.body.quantity,
                pricePerShare: req.body.pricePerShare,
                expiryDate: req.body.expiryDate, // Maybe add function to handle common intervals
                executed: false,
                activeLimitOrder: true,
            });
        }
        const portfolio = await Portfolio.findByIdAndUpdate(
            req.body.portfolioId, // Prob need to change
            { $push: { orders: order } },
            {
                upsert: true,
                new: true,
            },
            (err) => {
                if (err) throw err;
            },
        );
        res.send(portfolio);
    } catch (err) {
        res.status(400).send(err);
    }
};
