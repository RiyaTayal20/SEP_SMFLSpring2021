const fetch = require('node-fetch');

const { Order } = require('../models/portfolioModel');
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
        const { league: selectedLeague, username } = res.locals;
        // Define user portfolio
        selectedLeague.portfolioList.forEach((portfolio) => {
            if (portfolio.owner === username) {
                userPortfolio = portfolio;
            }
        });
        if (!userPortfolio) throw Error('User portfolio not found');
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
                executed: true, // Execute immediately
                activeLimitOrder: false,
                totalPrice: currPrice * req.body.quantity,
            });
            // Check current holdings
            let currHolding;
            userPortfolio.currentHoldings.forEach((holding) => {
                if (holding.ticker === req.body.tickerSymbol) {
                    currHolding = holding;
                }
            });
            const prevQuantity = (currHolding) ? currHolding.quantity : 0;
            // Add order to portfolio
            await League.findOneAndUpdate(
                { _id: selectedLeague._id, 'portfolioList.owner': username },
                {
                    $addToSet: { 'portfolioList.$.orders': order },
                    $set: { 'portfolioList.$.cash': (userPortfolio.cash - (currPrice * req.body.quantity)), 'portfolioList.$.currentHoldings': { ticker: req.body.tickerSymbol, quantity: prevQuantity + req.body.quantity } },
                },
                {
                    upsert: true,
                    new: true,
                },
                (err) => {
                    if (err) throw err;
                },
            );
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
            // Add order to portfolio
            await League.findOneAndUpdate(
                { _id: selectedLeague._id, 'portfolioList.owner': username },
                { $addToSet: { 'portfolioList.$.orders': order }, $set: { 'portfolioList.$.cash': userPortfolio.cash - (currPrice * req.body.quantity) } },
                {
                    upsert: true,
                    new: true,
                },
                (err) => {
                    if (err) throw err;
                },
            );
        }
        // Return updated portfolio to user
        const updatedLeague = await League.findOne(
            { leagueName: req.body.leagueName },
            (err) => {
                if (err) throw err;
            },
        );
        updatedLeague.portfolioList.forEach((portfolio) => {
            if (portfolio.owner === username) {
                res.send(portfolio);
            }
        });
    } catch (err) {
        console.log(err);
        res.status(400).send(err.toString());
    }
};
