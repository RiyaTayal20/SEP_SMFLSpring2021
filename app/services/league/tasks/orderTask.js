/** @module tasks/orderTask */

const fetch = require('node-fetch');

const League = require('../models/leagueModel');
const { getMarketPrice } = require('../utils/stockUtils');

exports.checkOrders = async () => {
    const leagues = await League.find(
        {},
        (err) => {
            if (err) throw err;
        }
    );
    for (league of leagues) {
        for (portfolio of league.portfolioList) {
            const openOrders = portfolio.orders.filter((order) => order.activeLimitOrder);
            await Promise.all(openOrders.map(async (order) => {
                const currPrice = await getMarketPrice(order.tickerSymbol).then((data) => data.price);
                switch (order.orderType) {
                    case 'limitBuy':
                        if (currPrice <= order.pricePerShare) {
                            let currHolding;
                            portfolio.currentHoldings.forEach((holding) => {
                                if (holding.ticker === order.tickerSymbol) {
                                    currHolding = holding;
                                }
                            });
                            const prevQuantity = (currHolding) ? currHolding.quantity : 0;
                            if (prevQuantity === 0) { // Does not currently have any shares, add entry to holdings
                                await League.findOneAndUpdate(
                                    { _id: league._id, 'portfolioList.owner': portfolio.owner },
                                    {
                                        $addToSet: {
                                            'portfolioList.$[element0].currentHoldings': { ticker: order.tickerSymbol, quantity: order.quantity },
                                        },
                                        $set: {
                                            'portfolioList.$[element0].cash': (portfolio.cash - (currPrice * order.quantity)),
                                            'portfolioList.$[element0].orders.$[element1].executed': true,
                                            'portfolioList.$[element0].orders.$[element1].activeLimitOrder': false,
                                        },
                                    },
                                    {
                                        upsert: true,
                                        new: true,
                                        arrayFilters: [
                                            { 'element0.owner': portfolio.owner },
                                            { 'element1._id': order._id },
                                        ]
                                    },
                                    (err) => {
                                        if (err) throw err;
                                    },
                                );
                            } else { // Has holdings, can just update quantity
                                await League.findOneAndUpdate(
                                    { _id: league._id },
                                    {
                                        $set: {
                                            'portfolioList.$[element0].cash': (portfolio.cash - (currPrice * order.quantity)),
                                            'portfolioList.$[element0].currentHoldings.$[element1].quantity': prevQuantity + order.quantity,
                                            'portfolioList.$[element0].orders.$[element2].executed': true,
                                            'portfolioList.$[element0].orders.$[element2].activeLimitOrder': false,
                                        },
                                    },
                                    {
                                        upsert: true,
                                        new: true,
                                        arrayFilters: [
                                            { 'element0.owner': portfolio.owner },
                                            { 'element1.ticker': order.tickerSymbol },
                                            { 'element2._id': order._id },
                                        ],
                                    },
                                    (err) => {
                                        if (err) throw err;
                                    },
                                );
                            }
                        }
                        break;
                    case "limitSell":
                        if (currPrice <= order.pricePerShare) {
                            let currHolding;
                            portfolio.currentHoldings.forEach((holding) => {
                                if (holding.ticker === order.tickerSymbol) {
                                    currHolding = holding;
                                }
                            });
                            const currQuantity = (currHolding) ? currHolding.quantity : 0;
                            if (currQuantity === order.quantity) { // Selling all shares
                                await League.findOneAndUpdate(
                                    { _id: league._id, 'portfolioList.owner': portfolio.owner },
                                    {
                                        $pull: {
                                            'portfolioList.$[element0].currentHoldings': { ticker: order.tickerSymbol },
                                        },
                                        $set: {
                                            'portfolioList.$[element0].cash': (portfolio.cash + (currPrice * order.quantity)),
                                            'portfolioList.$[element0].orders.$[element1].executed': true,
                                            'portfolioList.$[element0].orders.$[element1].activeLimitOrder': false,
                                        },
                                    },
                                    {
                                        upsert: true,
                                        new: true,
                                        arrayFilters: [
                                            { 'element0.owner': portfolio.owner },
                                            { 'element1._id': order._id },
                                        ]
                                    },
                                    (err) => {
                                        if (err) throw err;
                                    },
                                );
                            } else if (currQuantity > order.quantity) { // Has holdings remaining after selling
                                await League.findOneAndUpdate(
                                    { _id: league._id },
                                    {
                                        $set: {
                                            'portfolioList.$[element0].cash': (portfolio.cash + (currPrice * order.quantity)),
                                            'portfolioList.$[element0].currentHoldings.$[element1].quantity': currQuantity - order.quantity,
                                            'portfolioList.$[element0].orders.$[element2].executed': true,
                                            'portfolioList.$[element0].orders.$[element2].activeLimitOrder': false,
                                        },
                                    },
                                    {
                                        upsert: true,
                                        new: true,
                                        arrayFilters: [
                                            { 'element0.owner': portfolio.owner },
                                            { 'element1.ticker': order.tickerSymbol },
                                            { 'element2._id': order._id },
                                        ],
                                    },
                                    (err) => {
                                        if (err) throw err;
                                    },
                                );
                            }
                        }
                        break;
                    case 'stopBuy':
                        if (currPrice >= order.pricePerShare) {
                            let currHolding;
                            portfolio.currentHoldings.forEach((holding) => {
                                if (holding.ticker === order.tickerSymbol) {
                                    currHolding = holding;
                                }
                            });
                            const prevQuantity = (currHolding) ? currHolding.quantity : 0;
                            if (prevQuantity === 0) { // Does not currently have any shares, add entry to holdings
                                await League.findOneAndUpdate(
                                    { _id: league._id, 'portfolioList.owner': portfolio.owner },
                                    {
                                        $addToSet: {
                                            'portfolioList.$[element0].currentHoldings': { ticker: order.tickerSymbol, quantity: order.quantity },
                                        },
                                        $set: {
                                            'portfolioList.$[element0].cash': (portfolio.cash - (currPrice * order.quantity)),
                                            'portfolioList.$[element0].orders.$[element1].executed': true,
                                            'portfolioList.$[element0].orders.$[element1].activeLimitOrder': false,
                                        },
                                    },
                                    {
                                        upsert: true,
                                        new: true,
                                        arrayFilters: [
                                            { 'element0.owner': portfolio.owner },
                                            { 'element1._id': order._id },
                                        ]
                                    },
                                    (err) => {
                                        if (err) throw err;
                                    },
                                );
                            } else { // Has holdings, can just update quantity
                                await League.findOneAndUpdate(
                                    { _id: league._id },
                                    {
                                        $set: {
                                            'portfolioList.$[element0].cash': (portfolio.cash - (currPrice * order.quantity)),
                                            'portfolioList.$[element0].currentHoldings.$[element1].quantity': prevQuantity + order.quantity,
                                            'portfolioList.$[element0].orders.$[element2].executed': true,
                                            'portfolioList.$[element0].orders.$[element2].activeLimitOrder': false,
                                        },
                                    },
                                    {
                                        upsert: true,
                                        new: true,
                                        arrayFilters: [
                                            { 'element0.owner': portfolio.owner },
                                            { 'element1.ticker': order.tickerSymbol },
                                            { 'element2._id': order._id },
                                        ],
                                    },
                                    (err) => {
                                        if (err) throw err;
                                    },
                                );
                            }
                        }
                        break;
                    case 'stopSell':
                        if (currPrice >= order.pricePerShare) {
                            let currHolding;
                            portfolio.currentHoldings.forEach((holding) => {
                                if (holding.ticker === order.tickerSymbol) {
                                    currHolding = holding;
                                }
                            });
                            const currQuantity = (currHolding) ? currHolding.quantity : 0;
                            if (currQuantity === order.quantity) { // Selling all shares
                                await League.findOneAndUpdate(
                                    { _id: league._id, 'portfolioList.owner': portfolio.owner },
                                    {
                                        $pull: {
                                            'portfolioList.$[element0].currentHoldings': { ticker: order.tickerSymbol },
                                        },
                                        $set: {
                                            'portfolioList.$[element0].cash': (portfolio.cash + (currPrice * order.quantity)),
                                            'portfolioList.$[element0].orders.$[element1].executed': true,
                                            'portfolioList.$[element0].orders.$[element1].activeLimitOrder': false,
                                        },
                                    },
                                    {
                                        upsert: true,
                                        new: true,
                                        arrayFilters: [
                                            { 'element0.owner': portfolio.owner },
                                            { 'element1._id': order._id },
                                        ]
                                    },
                                    (err) => {
                                        if (err) throw err;
                                    },
                                );
                            } else if (currQuantity > order.quantity) { // Has holdings remaining after selling
                                await League.findOneAndUpdate(
                                    { _id: league._id },
                                    {
                                        $set: {
                                            'portfolioList.$[element0].cash': (portfolio.cash + (currPrice * order.quantity)),
                                            'portfolioList.$[element0].currentHoldings.$[element1].quantity': currQuantity - order.quantity,
                                            'portfolioList.$[element0].orders.$[element2].executed': true,
                                            'portfolioList.$[element0].orders.$[element2].activeLimitOrder': false,
                                        },
                                    },
                                    {
                                        upsert: true,
                                        new: true,
                                        arrayFilters: [
                                            { 'element0.owner': portfolio.owner },
                                            { 'element1.ticker': order.tickerSymbol },
                                            { 'element2._id': order._id },
                                        ],
                                    },
                                    (err) => {
                                        if (err) throw err;
                                    },
                                );
                            }
                        }
                        break;
                    default:
                        // throw new Error('Invalid order type');
                }
            }));
        };
    };
};
