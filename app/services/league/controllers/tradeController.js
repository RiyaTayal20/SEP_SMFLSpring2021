/** @module controllers/tradeController */

const { Order } = require('../models/portfolioModel');
const League = require('../models/leagueModel');
const { getMarketPrice } = require('../utils/stockUtils');

const MARKET_ORDERS = ['marketBuy', 'marketSell'];

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
                .then((data) => {
                    currPrice = data.price;
                })
                .catch((err) => console.error(err));
            if(req.body.orderType === 'marketBuy') {
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
                if (prevQuantity === 0) { // Does not currently have any shares, add entry to holdings
                    await League.findOneAndUpdate(
                        { _id: selectedLeague._id, 'portfolioList.owner': username },
                        {
                            $addToSet: {
                                'portfolioList.$.orders': order,
                                'portfolioList.$.currentHoldings': { ticker: req.body.tickerSymbol, quantity: req.body.quantity },
                            },
                            $set: { 'portfolioList.$.cash': (userPortfolio.cash - (currPrice * req.body.quantity)) },
                        },
                        {
                            upsert: true,
                            new: true,
                        },
                        (err) => {
                            if (err) throw err;
                        },
                    );
                } else { // Has holdings, can just update quantity
                    await League.findOneAndUpdate(
                        { _id: selectedLeague._id },
                        {
                            $addToSet: { 'portfolioList.$[element0].orders': order },
                            $set: {
                                'portfolioList.$[element0].cash': (userPortfolio.cash - (currPrice * req.body.quantity)),
                                'portfolioList.$[element0].currentHoldings.$[element1].quantity': parseInt(prevQuantity, 10) + parseInt(req.body.quantity, 10),
                            },
                        },
                        {
                            upsert: true,
                            new: true,
                            arrayFilters: [
                                { 'element0.owner': username },
                                { 'element1.ticker': req.body.tickerSymbol },
                            ],
                        },
                        (err) => {
                            if (err) throw err;
                        },
                    );
                }
            } else { // Market sell
                // Check current holdings
                let currHolding;
                userPortfolio.currentHoldings.forEach((holding) => {
                    if (holding.ticker === req.body.tickerSymbol) {
                        currHolding = holding;
                    }
                });
                // Check that user has enough shares
                if (currHolding.quantity < req.body.quantity) {
                    throw Error('Insufficient holdings');
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
                    totalPrice: -1 * currPrice * req.body.quantity,
                });
                const newQuantity = currHolding.quantity - req.body.quantity;
                // Add order to portfolio
                if (newQuantity === 0) { // Sold all shares, remove from holdings list
                    await League.findOneAndUpdate(
                        { _id: selectedLeague._id, 'portfolioList.owner': username },
                        {
                            $addToSet: {
                                'portfolioList.$.orders': order,
                            },
                            $pull: {
                                'portfolioList.$.currentHoldings': { ticker: req.body.tickerSymbol },
                            },
                            $set: { 'portfolioList.$.cash': (userPortfolio.cash + (currPrice * req.body.quantity)) },
                        },
                        {
                            upsert: true,
                            new: true,
                        },
                        (err) => {
                            if (err) throw err;
                        },
                    );
                } else { // Still has shares
                    await League.findOneAndUpdate(
                        { _id: selectedLeague._id },
                        {
                            $addToSet: { 'portfolioList.$[element0].orders': order },
                            $set: {
                                'portfolioList.$[element0].cash': (userPortfolio.cash + (currPrice * req.body.quantity)),
                                'portfolioList.$[element0].currentHoldings.$[element1].quantity': parseInt(newQuantity, 10),
                            },
                        },
                        {
                            upsert: true,
                            new: true,
                            arrayFilters: [
                                { 'element0.owner': username },
                                { 'element1.ticker': req.body.tickerSymbol },
                            ],
                        },
                        (err) => {
                            if (err) throw err;
                        },
                    );
                }
            }
        } else { // Limit order: DEMO #2
            order = new Order({
                orderType: req.body.orderType,
                portfolioId: userPortfolio._id,
                tickerSymbol: req.body.tickerSymbol,
                quantity: req.body.quantity,
                pricePerShare: req.body.pricePerShare,
                expiryDate: req.body.expiryDate, // Maybe add function to handle common intervals
                executed: false,
                activeLimitOrder: true,
                totalPrice: req.body.quantity * req.body.pricePerShare,
            });
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
