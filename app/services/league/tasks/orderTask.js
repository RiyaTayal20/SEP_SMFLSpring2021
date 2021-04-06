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
                const currPrice = await getMarketPrice(order.tickerSymbol);
                switch (order.orderType) {
                    case 'limitBuy':
                        if (order.pricePerShare <= currPrice) {
                            let currHolding;
                            portfolio.currentHoldings.forEach((holding) => {
                                if (holding.ticker === order.tickerSymbol) {
                                    currHolding = holding;
                                }
                            });
                            const prevQuantity = (currHolding) ? currHolding.quantity : 0;
                            if (prevQuantity === 0) { // Does not currently have any shares, add entry to holdings
                                await League.findOneAndUpdate(
                                    { _id: league._id, 'portfolioList.owner': portfolio.username },
                                    {
                                        $addToSet: {
                                            'portfolioList.$.currentHoldings': { ticker: order.tickerSymbol, quantity: order.quantity },
                                        },
                                        $set: { 'portfolioList.$.cash': (portfolio.cash - (currPrice * order.quantity)) },
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
                                        $set: {
                                            'portfolioList.$[element0].cash': (portfolio.cash - (currPrice * order.quantity)),
                                            'portfolioList.$[element0].currentHoldings.$[element1].quantity': prevQuantity + order.quantity,
                                        },
                                    },
                                    {
                                        upsert: true,
                                        new: true,
                                        arrayFilters: [
                                            { 'element0.owner': username },
                                            { 'element1.ticker': order.tickerSymbol },
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
