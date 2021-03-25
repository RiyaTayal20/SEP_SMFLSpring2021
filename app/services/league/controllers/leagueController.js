const League = require('../models/leagueModel');
const User = require('../models/userModel');
const { Portfolio } = require('../models/portfolioModel');
const { getMarketPrice, getStatistics } = require('../utils/stockUtils');

const addPlayerToLeague = async (user, leagueID) => {
    const league = await League.findById(
        leagueID,
        (err) => {
            if (err) throw err;
        },
    );
    return Promise.all([
        await League.findByIdAndUpdate(
            leagueID,
            {
                $addToSet: {
                    playerList: user,
                    portfolioList: new Portfolio({
                        owner: user,
                        league: leagueID,
                        cash: league.settings.balance,
                        netWorth: league.settings.balance,
                    }),
                },
            },
            {},
            (err) => {
                if (err) throw err;
            },
        ),
        await User.findOneAndUpdate(
            { username: user },
            { $addToSet: { leagues: leagueID } },
            {},
            (err) => {
                if (err) throw err;
            },
        ),
    ]);
};

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

const retrievePortfolioInfo = async (username, league) => {
    const currentValue = await calculatePortfolioValue(username, league._id);
    // Update portfolio
    await League.findOneAndUpdate(
        { _id: league._id, 'portfolioList.owner': username },
        {
            $set: { 'portfolioList.$.currentNetWorth': currentValue },
        },
        {
            new: true,
        },
        (err) => {
            if (err) throw err;
        },
    );
    // Return updated portfolio to user
    const updatedLeague = await League.findOne(
        { leagueName: league.leagueName },
        (err) => {
            if (err) throw err;
        },
    );
    let portfolio;
    updatedLeague.portfolioList.forEach((leaguePortfolio) => {
        if (leaguePortfolio.owner === username) {
            portfolio = leaguePortfolio;
        }
    });
    if (portfolio) {
        const responseInfo = {
            currentNetWorth: portfolio.currentNetWorth,
            cashAvailable: portfolio.cash,
            holdings: portfolio.currentHoldings,
            netWorth: portfolio.netWorth,
        };
        return responseInfo;
    }
    throw Error('Portfolio not found');
};

const calculateCostBasis = (ticker, portfolio) => {
    let totalCost = 0;
    let numShares = 0;
    portfolio.orders.forEach((order) => {
        if (order.tickerSymbol === ticker && order.executed === true) {
            totalCost += order.totalPrice;
            numShares += order.quantity;
        }
    });
    if (numShares <= 0) return 0; // Should not happen
    return totalCost / numShares;
};

exports.createLeague = async (req, res) => {
    const user = res.locals.username;

    if (req.body.settings.maxPlayers < 1) {
        return res.status(400).send('The maximum number of players must be positive');
    }

    // TO-DO:
    // Add more checks to validate create League info

    const league = new League({
        leagueName: req.body.leagueName,
        leagueManager: user,
        leagueKey: req.body.leagueKey,
        settings: req.body.settings,
    });

    try {
        const savedLeague = await league.save();
        addPlayerToLeague(user, savedLeague._id).then(() => {
            res.send(savedLeague);
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.joinLeague = async (req, res) => {
    const { _id } = res.locals.league;
    const { username } = res.locals;

    if (res.locals.league.playerList.includes(username)) {
        return res.status(422).send(`Cannot join league that you are already a part of! (${req.body.leagueName}) \n`);
    }
    if (res.locals.league.playerList.length >= res.locals.league.settings.maxPlayers) {
        return res.status(400).send(`Cannot join league since it is full! (${req.body.leagueName}) \n`);
    }

    addPlayerToLeague(username, _id)
        .then((succ) => res.status(422).send(`Sucessfully joined league! (${req.body.leagueName}) \n ${succ}`))
        .catch((err) => res.status(422).send(`{${err}}`));
};

exports.leaveLeague = async (req, res) => {
    const { _id } = res.locals.league;
    const { username } = res.locals;

    if (!res.locals.league.playerList.includes(username)) {
        return res.status(422).send(`Cannot leave league! Please make sure that you are a part of the league, (${req.body.leagueName}) before attempting to leave`);
    }

    const request = Promise.all([
        await League.findByIdAndUpdate(
            _id,
            { $pull: { playerList: username } },
            { new: true },
            (err) => {
                if (err) throw err;
            },
        ),
        await User.findOneAndUpdate(
            { username },
            { $pull: { leagues: _id } },
            { new: true },
            (err) => {
                if (err) throw err;
            },
        ),
        await League.findOneAndUpdate(
            { 'portfolioList.owner': username },
            { $pull: { portfolioList: { owner: username } } },
            { new: true },
            (err) => {
                if (err) throw err;
            },
        ),
    ]);
    request
        .then((succ) => res.send(`Successfully left league (${req.body.leagueName})\n ${succ}`))
        .catch((err) => res.status(422).send(`{${err}}`));
};

exports.getLeagues = async (req, res) => {
    await League.find({}, (err, result) => {
        if (err) throw err;
        else res.send(result);
    });
};

exports.getLeagueNames = async (req, res) => {
    await League.find({}, 'leagueName', (err, result) => {
        if (err) throw err;
        res.send(result);
    });
};

exports.getLeagueByName = async (req, res) => {
    await League.findOne({ leagueName: req.params.leagueName }, (err, result) => {
        if (err) throw err;
        if (!result) res.status(404).send('League(s) not found');
        else res.send(result);
    });
};

exports.disbandLeague = async (req, res) => {
    const { _id, leagueManager: manager } = res.locals.league;
    const { username } = res.locals;

    if (manager !== username) {
        return res.status(401).send('Cannot disband league. User is not the league manager');
    }

    const delReq = Promise.all([
        await League.deleteOne(
            { _id },
            {},
            (err) => {
                if (err) throw err;
            },
        ),
        await User.updateMany(
            { leagues: { $in: _id } },
            { $pull: { leagues: _id } },
            {},
            (err) => {
                if (err) throw err;
            },
        ),
    ]);

    delReq.then(() => res.send(`Successfully disbanded league! (${res.locals.league.leagueName})`))
        .catch((err) => res.status(422).send(`Cannot disband league cleanly. Unknown Error occurred. \n ${err}`));
};

exports.getPortfolio = async (req, res) => {
    try {
        const { username, league } = res.locals;
        // Get current net worth, cash, holdings, net worth history
        const portfolioInfo = await retrievePortfolioInfo(username, league);
        // eslint-disable-next-line max-len, no-return-assign, no-param-reassign, no-sequences
        const remapHoldings = portfolioInfo.holdings.reduce((obj, { ticker, quantity }) => (obj[ticker] = { quantity }, obj), {});
        const updatedLeague = await League.findOne(
            { leagueName: league.leagueName },
            (err) => {
                if (err) throw err;
            },
        );
        let portfolio;
        updatedLeague.portfolioList.forEach((leaguePortfolio) => {
            if (leaguePortfolio.owner === username) {
                portfolio = leaguePortfolio;
            }
        });
        // Get current prices, cost basis, descriptions, total gain/loss
        const currentPrices = [];
        const statistics = [];
        for (let i = 0; i < portfolioInfo.holdings.length; i += 1) {
            const { ticker } = portfolioInfo.holdings[i];
            // Start async calls for current price and statistics
            currentPrices.push(getMarketPrice(ticker));
            statistics.push(getStatistics(ticker));
            // Get cost basis
            const costBasis = calculateCostBasis(ticker, portfolio);
            remapHoldings[ticker].costBasis = costBasis;
        }
        const setPrices = await Promise.all(currentPrices).then((result) => {
            for (let i = 0; i < portfolioInfo.holdings.length; i += 1) {
                const { ticker, quantity } = portfolioInfo.holdings[i];
                // Current and total price
                remapHoldings[ticker].currentPrice = result[i].price;
                remapHoldings[ticker].totalValue = result[i].price * quantity;
                // Gain/loss
                // eslint-disable-next-line max-len
                remapHoldings[ticker].totalChange = (remapHoldings[ticker].costBasis * quantity) - remapHoldings[ticker].totalValue;
                // eslint-disable-next-line max-len
                remapHoldings[ticker].percentChange = remapHoldings[ticker].totalChange / (remapHoldings[ticker].costBasis * quantity);
            }
        });
        const setNames = await Promise.all(statistics).then((result) => {
            // Get equity name
            for (let i = 0; i < portfolioInfo.holdings.length; i += 1) {
                const { ticker } = portfolioInfo.holdings[i];
                remapHoldings[ticker].equityName = result[i].equityName;
            }
        });
        await Promise.all([setPrices, setNames]).then(() => {
            const fullResponse = {
                currentNetWorth: portfolioInfo.currentNetWorth,
                cashAvailable: portfolioInfo.cashAvailable,
                holdings: remapHoldings,
                netWorth: portfolioInfo.netWorth,
            };
            res.json(fullResponse);
        });
    } catch (err) {
        console.log(err);
        res.status(400).send(err.toString());
    }
};
