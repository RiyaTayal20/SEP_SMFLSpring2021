/** @module tasks/netWorthTask */

const League = require('../models/leagueModel');
const { getMarketPrice } = require('../utils/stockUtils');

const calculatePortfolioValue = async (username, leagueID) => {
    const league = await League.findById(
        leagueID,
        (err) => {
            if (err) throw err;
        },
    );
    let userPortfolio;
    league.portfolioList.forEach((portfolio) => {
        if (portfolio.owner === username) {
            userPortfolio = portfolio;
        }
    });
    if (!userPortfolio) throw Error('User portfolio not found');
    // Calculate current value
    // eslint-disable-next-line max-len
    const prices = await Promise.all(userPortfolio.currentHoldings.map((holding) => getMarketPrice(holding.ticker)));
    const quantities = userPortfolio.currentHoldings.map((holding) => holding.quantity);
    // eslint-disable-next-line max-len
    return prices.reduce((acc, price, i) => acc + ((price.price * quantities[i]) || 0), 0) + userPortfolio.cash;
};

exports.addNetWorth = async () => {
    const leagues = await League.find({});
    for (i = 0; i < Object.keys(leagues).length; i += 1) {
        for (j = 0; j < leagues[i].portfolioList.length; j += 1) {
            const currentNetWorth = {
                date: new Date(),
                worth: await calculatePortfolioValue(leagues[i].portfolioList[j].owner, leagues[i]._id)
            }
            await League.findOneAndUpdate(
                { _id: leagues[i]._id, 'portfolioList.owner': leagues[i].portfolioList[j].owner },
                { $addToSet: { 'portfolioList.$.netWorth': currentNetWorth } },
                { new: true },
                (err) => {
                    if (err) throw err;
                },
            );
        }
    }
};