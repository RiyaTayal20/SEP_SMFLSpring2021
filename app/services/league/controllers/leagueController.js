/** @module controllers/leagueController */

const League = require('../models/leagueModel');
const User = require('../models/userModel');
const { Portfolio } = require('../models/portfolioModel');
const { getMarketPrice, getStatistics, getHistorical } = require('../utils/stockUtils');
const { getNews } = require('../utils/newsUtils');
const bcrypt = require('bcryptjs');

/**
 * Add a user to a specified league and create an associated portfolio
 * @async
 * @function
 * @param {String} user The username of the target user
 * @param {ObjectId} leagueID The _id for the league
 * @returns {Promise}
 */
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
                        currentNetWorth: league.settings.balance,
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

/**
 * Gather current equity prices and calculate the current value of the specified portfolio.
 * @async
 * @function
 * @param {String} username The username of the user
 * @param {ObjectId} leagueID The _id of the league the portfolio is in
 * @returns {number} Current value of the portfolio
 */
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

const calculatePortfolioPercentChange = async (username, leagueID) => {
    const league = await League.findById(
        leagueID,
        (err) => {
            if(err) throw err;
        },
    );
    let userPortfolio;
    league.portfolioList.forEach((portfolio) => {
        if (portfolio.owner === username) {
            userPortfolio = portfolio;
        }
    });
    if (!userPortfolio) throw Error('User Portfolio not found');
    const holdingStats = await Promise.all(userPortfolio.currentHoldings.map((holding) => getStatistics(holding.ticker)));
    const currMarketPrices = await Promise.all(userPortfolio.currentHoldings.map((holding) => getMarketPrice(holding.ticker)));
    const holdingQuantities = userPortfolio.currentHoldings.map((holding) => holding.quantity);
    const holdingWeights = currMarketPrices.map((share, i) => (share.price * holdingQuantities[i]) / userPortfolio.currentNetWorth);
    let portfolioPercentChange = 0;
    for (i = 0; i < holdingWeights.length; i++) {
        portfolioPercentChange += holdingWeights[i] * holdingStats[i].percentChange;
    };
    return portfolioPercentChange;
};

/**
 * Gather net worth, cash, holdings, and historical net worth for a portfolio
 * @async
 * @function
 * @param {String} username The username of the user
 * @param {ObjectId} league The _id of the league the portfolio is in
 * @returns {Object} Returns object with keys for each field
 */
const retrievePortfolioInfo = async (username, league) => {
    const currentValue = await calculatePortfolioValue(username, league._id);
    const currentPercentChange = await calculatePortfolioPercentChange(username, league._id);
    // Update portfolio
    await League.findOneAndUpdate(
        { _id: league._id, 'portfolioList.owner': username },
        {
            $set: {
                'portfolioList.$.currentNetWorth': currentValue,
                'portfolioList.$.closePercentChange': currentPercentChange
            },
        },
        {
            new: true
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
            owner: portfolio.owner,
            currentNetWorth: portfolio.currentNetWorth,
            closePercentChange: portfolio.closePercentChange,
            cashAvailable: portfolio.cash,
            holdings: portfolio.currentHoldings,
            netWorth: portfolio.netWorth,
            orders: portfolio.orders,
        };
        return responseInfo;
    }
    throw Error('Portfolio not found');
};

const getPortfolioHoldings = async (username, league) => {
    const queriedLeague = await League.findOne(
        { leagueName: league },
        (err) => {
            if (err) throw err;
        },
    );
    let portfolio;
    queriedLeague.portfolioList.forEach((leaguePortfolio) => {
        if (leaguePortfolio.owner === username) {
            portfolio = leaguePortfolio;
        }
    });
    return portfolio.currentHoldings;
};

/**
 * Calculate the average cost basis for a specific equity in a user's portfolio
 * @function
 * @param {String} ticker The ticker symbol of the specified equity
 * @param {Object} portfolio The portfolio to check
 * @returns {number} The average cost baosis
 */
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

/**
 * Creates AI player, adds player to league and creates portfolio
 * @function
 * @param {Number} count The bot number that corresponds to algorithm
 * @param {ObjectId} leagueID The _id of the league the bot is in
 */
const createAIplayer = async (count, leagueID) => {
    // create bot as new user
    let algorithm = "mean";
    if (count == 2) algorithm = "momentum";
    else if (count == 3) algorithm = "candlesticks";
    const bot = new User({
        username: `bot-${count}`,
        email: `bot@bot.com`,
        password: bcrypt.hashSync('xxxxxxx',8),
        leagues: leagueID,
        isBot: true,
        algorithm: algorithm,
    });
    try {
        const savedBot = await bot.save();
        const league = await League.findById(leagueID);
        // create portfolio for bot and add to league
        await League.findByIdAndUpdate(
            leagueID,
            {
                $addToSet: {
                    playerList: `bot-${count}`,
                    portfolioList: new Portfolio({
                        owner: `bot-${count}`,
                        league: league,
                        cash: league.settings.balance,
                        netWorth: league.settings.balance,
                        currentNetWorth: league.settings.balance,
                    }),
                },
            },
        )
    } catch (err) {
        if (err) throw err;
    }
};

/**
 * Create a league with the specified parameters in the request body
 * @async
 * @function
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Object}
 */
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
        // creates ai bots
        if (savedLeague.settings.aiPlayer > 0) {
            let count = 1;
            while(count <= savedLeague.settings.aiPlayer) {
                createAIplayer(count, savedLeague._id);
                count += 1;
            }
        }
        addPlayerToLeague(user, savedLeague._id).then(() => {
            res.send(savedLeague);
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

/**
 * Add a user to a requested league
 * @async
 * @function
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Object}
 */
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
        .then((succ) => res.send(`Sucessfully joined league! (${req.body.leagueName}) \n ${succ}`))
        .catch((err) => res.status(422).send(`{${err}}`));
};

/**
 * Remove a user for a league they are a part of
 * @async
 * @function
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Object}
 */
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

/**
 * Get all current leagues
 * @async
 * @function
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Object} All current leagues
 */
exports.getLeagues = async (req, res) => {
    await League.find({}, (err, result) => {
        if (err) throw err;
        else res.send(result);
    });
};

/**
 * Get the names of all current leagues
 * @async
 * @function
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Object} Names of all current leagues
 */
exports.getLeagueNames = async (req, res) => {
    await League.find({}, 'leagueName', (err, result) => {
        if (err) throw err;
        res.send(result);
    });
};

/**
 * Retrieve a league name given id
 * @async
 * @function
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
 exports.getLeagueByID = async (req, res) => {
    await League.findOne({ _id: req.params.id }, 'leagueName', (err, result) => {
        if (err) throw err;
        if (!result) res.status(404).send('League(s) not found');
        else res.send(result);
    });
};

/**
 * Retrieve a league given the name
 * @async
 * @function
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
exports.getLeagueByName = async (req, res) => {
    await League.findOne({ leagueName: req.params.leagueName }, (err, result) => {
        if (err) throw err;
        if (!result) res.status(404).send('League(s) not found');
        else res.send(result);
    });
};

/**
 * Disband a league when requested by league manager
 * @async
 * @function
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Object}
 */
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

/**
 * Kick a player when requested by league manager
 * @async
 * @function
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Object}
 */
exports.kickPlayer = async (req, res) => {
    const { username } = res.locals;
    const playerToKick = req.body.username;

    const league = await League
        .findOne({
            leagueName: req.params.league,
        })
        .then((result) => result)
        .catch(() => null);
    if (!league) return res.status(404).json('Error: League not found');

    const manager = league.leagueManager;
    if (manager !== username) {
        return res.status(401).send('Cannot kick player. User is not the league manager');
    }
    if(manager === playerToKick){
        return res.status(401).send('Cannot kick the league manager from league');
    }
    if(!league.playerList.includes(playerToKick)) {
        return res.status(404).json('Error: Player to Kick not found');
    }

    /* At this point, we know:
    *    The league manager made the request
    *    The league exists
    *    The player to be kicked is in the league
    *    The player to kick is not the league manager
    */
    const kickPlayerReq = Promise.all([
        await League
        .findOneAndUpdate(
            {leagueName: league.leagueName},
            { $pull: {
                playerList: playerToKick,
                portfolioList: {owner: playerToKick}
                },
            },
            {},
            (err) => {
                if(err) throw err;
            },
        ),
        await User
        .findOneAndUpdate(
            {username: playerToKick},
            { $pull: { leagues: league._id } },
            {},
            (err) => {
                if (err) throw err;
            },
        ),
    ]);

    kickPlayerReq
        .then(()=> res.send(`Successfully kicked player ${playerToKick} from ${league.leagueName}!`))
        .catch((err) => res.status(400).json(`Cannot kick player cleanly. Unknown Error occurred. \n ${err}`));
}

/**
 * Add money to a player's portfolio when requested by league manager
 * @async
 * @function
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Object}
 */
 exports.addMoneyToPlayer = async (req, res) => {
    const { username } = res.locals;
    const playerToDonate = req.body.username;

    const league = await League
        .findOne({
            leagueName: req.params.league,
        })
        .then((result) => result)
        .catch(() => null);
    if (!league) return res.status(404).json('Error: League not found');

    const manager = league.leagueManager;
    if (manager !== username) {
        return res.status(401).send('Cannot add money to player. User is not the league manager');
    }
    if(!league.playerList.includes(playerToDonate)) {
        return res.status(404).json('Error: Recipient player not found');
    }

    /* At this point, we know:
    *    The league manager made the request
    *    The league exists
    *    The recipient player is in the league
    */
    let cash;
    league.portfolioList.forEach((portfolio) => {
        if(portfolio.owner === playerToDonate){
            cash = portfolio.cash;
        }
    });

    const addMoneyToPlayerReq = League
        .findOneAndUpdate(
            {
                leagueName: league.leagueName,
                'portfolioList.owner': playerToDonate,
            },
            { $set: {'portfolioList.$.cash' : (parseInt(cash) + parseInt(req.body.cash)) },},
            {},
            (err) => {
                if(err) throw err;
            },
        );

    addMoneyToPlayerReq
        .then(()=> res.send(`Successfully gave $${req.body.cash} to player ${playerToDonate} in ${league.leagueName}!`))
        .catch((err) => res.status(422).json(`Cannot give money to player. Unknown Error occurred. \n ${err}`));
}


/**
 * Retrieve a portfolio for user in a specified league
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Object}
 */
exports.getPortfolio = async (req, res) => {
    try {
        const { username } = res.locals;
        // Need to check league since middleware only checks body
        const league = await League
            .findOne({
                leagueName: req.params.league,
            })
            .then((result) => result)
            .catch(() => null);
        if (!league) return res.status(422).json('Error: League not found');
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
            remapHoldings[ticker].costBasis = costBasis.toFixed(2);
        }
        const setPrices = await Promise.all(currentPrices).then((result) => {
            for (let i = 0; i < portfolioInfo.holdings.length; i += 1) {
                const { ticker, quantity } = portfolioInfo.holdings[i];
                // Current and total price
                remapHoldings[ticker].currentPrice = result[i].price.toFixed(2);
                remapHoldings[ticker].totalValue = (result[i].price * quantity).toFixed(2);
                // Gain/loss
                // eslint-disable-next-line max-len
                remapHoldings[ticker].totalChange = (remapHoldings[ticker].totalValue - (remapHoldings[ticker].costBasis * quantity)).toFixed(2);
                // eslint-disable-next-line max-len
                remapHoldings[ticker].percentChange = (remapHoldings[ticker].totalChange / (remapHoldings[ticker].costBasis * quantity)).toFixed(2);
            }
        });
        const setNames = await Promise.all(statistics).then((result) => {
            // Get equity name
            for (let i = 0; i < portfolioInfo.holdings.length; i += 1) {
                const { ticker } = portfolioInfo.holdings[i];
                remapHoldings[ticker].equityName = result[i].equityName;
                remapHoldings[ticker].closePercentChange = (result[i].percentChange * 100).toFixed(2);
            }
        });
        await Promise.all([setPrices, setNames]).then(() => {
            const fullResponse = {
                currentNetWorth: parseFloat(portfolioInfo.currentNetWorth).toFixed(2),
                cashAvailable: parseFloat(portfolioInfo.cashAvailable).toFixed(2),
                closePercentChange: (parseFloat(portfolioInfo.closePercentChange) * 100).toFixed(2),
                holdings: remapHoldings,
                netWorth: portfolioInfo.netWorth,
                orders: portfolioInfo.orders,
            };
            res.json(fullResponse);
        });
    } catch (err) {
        console.log(err);
        res.status(400).send(err.toString());
    }
};

/**
 * Retrieve a portfolio for user in a specified league
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Object}
 */
 exports.getSpecifiedPortfolio = async (req, res) => {
    try {
        const username = req.params.username;
        // Need to check league since middleware only checks body
        const league = await League
            .findOne({
                leagueName: req.params.league,
            })
            .then((result) => result)
            .catch(() => null);
        if (!league) return res.status(422).json('Error: League not found');
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
            remapHoldings[ticker].costBasis = costBasis.toFixed(2);
        }
        const setPrices = await Promise.all(currentPrices).then((result) => {
            for (let i = 0; i < portfolioInfo.holdings.length; i += 1) {
                const { ticker, quantity } = portfolioInfo.holdings[i];
                // Current and total price
                remapHoldings[ticker].currentPrice = result[i].price.toFixed(2);
                remapHoldings[ticker].totalValue = (result[i].price * quantity).toFixed(2);
                // Gain/loss
                // eslint-disable-next-line max-len
                remapHoldings[ticker].totalChange = (remapHoldings[ticker].totalValue - (remapHoldings[ticker].costBasis * quantity)).toFixed(2);
                // eslint-disable-next-line max-len
                remapHoldings[ticker].percentChange = (remapHoldings[ticker].totalChange / (remapHoldings[ticker].costBasis * quantity)).toFixed(2);
            }
        });
        const setNames = await Promise.all(statistics).then((result) => {
            // Get equity name
            for (let i = 0; i < portfolioInfo.holdings.length; i += 1) {
                const { ticker } = portfolioInfo.holdings[i];
                remapHoldings[ticker].equityName = result[i].equityName;
                remapHoldings[ticker].closePercentChange = (result[i].percentChange * 100).toFixed(2);
            }
        });
        await Promise.all([setPrices, setNames]).then(() => {
            const fullResponse = {
                currentNetWorth: parseFloat(portfolioInfo.currentNetWorth).toFixed(2),
                cashAvailable: parseFloat(portfolioInfo.cashAvailable).toFixed(2),
                closePercentChange: (parseFloat(portfolioInfo.closePercentChange) * 100).toFixed(2),
                holdings: remapHoldings,
                netWorth: portfolioInfo.netWorth,
                orders: portfolioInfo.orders,
            };
            res.json(fullResponse);
        });
    } catch (err) {
        console.log(err);
        res.status(400).send(err.toString());
    }
};

exports.getPortfolioNews = async (req, res) => {
    try {
        const { username } = res.locals;
        const portfolioHoldings = await getPortfolioHoldings(username, req.params.league);
        // Get news for all holdings
        const allNews = await Promise.all(portfolioHoldings.map(async (holding) => {
            return await getNews(holding.ticker);
        }));
        const sortedNews = allNews.flat().sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
        res.json(sortedNews);
    } catch (err) {
        console.log(err);
        res.status(400).send(err.toString());
    }
};

const getLastFriday = (day) => {
    let lastFriday = new Date(day);
    while (lastFriday.getDay() !=5 ) {
        lastFriday.setDate(lastFriday.getDate() - 1);
    }
    return lastFriday;
};

const getMonday = (d) => {
    d = new Date(d);
    let day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1);
    return new Date(d.setDate(diff));
};

const getPercentChange = (start, end) => {
    if (end > start) {
        percentChange = (end - start) / start * 100;   
    } else {
        percentChange = (end - start) / end * 100;
    }
    return percentChange;
}

const getIndexJSON = (array, username) => {
    let index;
    for (i = 0; i < array.length; i++) {
        if (array[i].username && array[i].username === username) index = i;
    }
    return index + 1;
};

exports.getSummary = async (req, res) => {
    const { username } = res.locals;
    let SPHistorical = await getHistorical('SPY', '6m');
    // SPHistorical = SPHistorical['6m'].prices;
    let percentageReturnRankings = [];
    let dollarReturnRankings = [];
    let startPortfolioTotals = 0;
    let endPortfolioTotals = 0;
    let startWorth;
    let endWorth;
    let SPStartWorth;
    let SPEndWorth;
    let personalReturn;
    let leagueReturn;
    let startWeek = new Date(req.query.week);
    const lastFriday = getLastFriday(startWeek);
    let tempDate = new Date(lastFriday);
    let endDay = new Date();
    const pastMonday = getMonday(endDay);
    startWeek.setHours(0,0,0,0);
    lastFriday.setHours(0,0,0,0);
    pastMonday.setHours(0,0,0,0);
    if (startWeek < pastMonday) {
        tempDate.setDate(tempDate.getDate() + 7);
        endDay = new Date(tempDate);
        console.log(`tempDate: ${tempDate}`);
        console.log(`endDay: ${endDay}`);
    } else {
        if (new Date().getHours() < 16) {
            endDay.setDate(endDay.getDate() - 1);
        }
    }

    endDay.setHours(0,0,0,0);

    const leagueInfo = await League.findOne({ leagueName: req.params.leagueName }, (err, result) => {
        if (err) throw err;
        if (!result) res.status(404).send('League(s) not found');
        else return result;
    });

    leagueInfo.portfolioList.forEach((portfolio) => {
        let playerStartWorth;
        let playerEndWorth;
        portfolio.netWorth.forEach((day) => {
            date = new Date(day.date);
            date.setHours(0,0,0,0);
            if (date.getTime() === lastFriday.getTime()) {
                playerStartWorth = day.worth;   
                if (portfolio.owner === username) {
                    startWorth = day.worth;
                } else {
                    startPortfolioTotals += day.worth;
                }
            }
            if (date.getTime() === endDay.getTime()) {
                playerEndWorth = day.worth;
                if (portfolio.owner === username) {
                    endWorth = day.worth;
                } else {
                    endPortfolioTotals += day.worth;
                }
            }
        });
        dollarReturnRankings.push({
            username: portfolio.owner,
            dollarReturn: parseFloat(playerEndWorth - playerStartWorth).toFixed(2)
        });
        percentageReturnRankings.push({
            username: portfolio.owner,
            percentageReturn: parseFloat(getPercentChange(playerStartWorth, playerEndWorth)).toFixed(2)
        });
    });

    for(let day in SPHistorical){
        date = new Date(day);
        console.log(day, date);
        date.setHours(0,0,0,0);
        date.setDate(date.getDate() + 1);
        if (date.getTime() === lastFriday.getTime()) {
            SPStartWorth = SPHistorical[day];
        }
        if (date.getTime() === endDay.getTime()) {
            SPEndWorth = SPHistorical[day];
        }
    }

    const startAverage = startPortfolioTotals / ((leagueInfo.portfolioList).length - 1);
    const endAverage = endPortfolioTotals / ((leagueInfo.portfolioList).length - 1);
    personalReturn = getPercentChange(startWorth, endWorth);
    leagueReturn = getPercentChange(startAverage, endAverage);
    dollarReturnRankings.sort((a, b) => parseFloat(b.dollarReturn) - parseFloat(a.dollarReturn));
    percentageReturnRankings.sort((a, b) => parseFloat(b.percentageReturn) - parseFloat(a.percentageReturn));
    dollarReturnPlace = getIndexJSON(dollarReturnRankings, username);
    percentageReturnPlace = getIndexJSON(percentageReturnRankings, username);
    const SPPercentageReturn = getPercentChange(SPStartWorth, SPEndWorth);

    const fullResponse = {
        startAverage: parseFloat(startAverage).toFixed(2),
        endAverage: parseFloat(endAverage).toFixed(2),
        leaguePercentageReturn: parseFloat(leagueReturn).toFixed(2),
        leagueDollarReturn: parseFloat(endAverage - startAverage).toFixed(2),
        leaguePercentageReturnDifference: parseFloat(personalReturn - leagueReturn).toFixed(2),
        leagueDollarReturnDifference: parseFloat((endWorth - startWorth) - (endAverage - startAverage)).toFixed(2),
        personalStartWorth: parseFloat(startWorth).toFixed(2),
        personalEndWorth: parseFloat(endWorth).toFixed(2),
        personalPercentageReturn: parseFloat(personalReturn).toFixed(2),
        personalDollarReturn: parseFloat(endWorth - startWorth).toFixed(2),
        dollarReturnRankings: dollarReturnRankings,
        percentageReturnRankings: percentageReturnRankings,
        dollarReturnPlace: dollarReturnPlace,
        percentageReturnPlace: percentageReturnPlace,
        SPPercentageReturn: parseFloat(SPPercentageReturn).toFixed(2),
        SPReturnDifference: parseFloat(personalReturn - SPPercentageReturn).toFixed(2),
    };
    res.json(fullResponse);
};

exports.insertNetWorth = async (req, res) => {
    const { username } = res.locals;
    const dates = req.body.date;
    const worths = req.body.worth;
    
     for (let i = 0; i < dates.length; i++) {
        const currentNetWorth = {
            date: dates[i],
            worth: parseFloat(worths[i])
        }
        await League.findOneAndUpdate(
            { _id: req.body.leagueID, 'portfolioList.owner':  username},
            { $addToSet: { 'portfolioList.$.netWorth': currentNetWorth } },
            { new: true },
            (err) => {
                if (err) throw err;
            },
        );
    } 

    res.send('Succ');
};

// Zip arrays

exports.getLeagueOverview = async (req, res) => {
    try {
        // Get league
        console.log(req.params.leagueName);
        const league = await League
        .findOne({
            leagueName: req.params.leagueName,
        })
        .then((result) => result)
        .catch((err) => console.log(err));
        console.log(league);
        if (!league) return res.status(422).json('Error: League not found');
        // Get portfolios and order for leaderboard
        const portfolios = await Promise.all(league.playerList.map(async (player) => await retrievePortfolioInfo(player, league)));
        const sortedPortfolios = portfolios.sort((a, b) => b.currentNetWorth - a.currentNetWorth)
        // Put position
        const portfolioWithPosition = sortedPortfolios.map((portfolio, position) => ({ ...portfolio, position: position+1 }));
        // Get % growth
        const portfolioWithGrowth = portfolioWithPosition.map((portfolio) => ({ ...portfolio, growth: (((portfolio.currentNetWorth / league.settings.balance) - 1) * 100).toFixed(3) }))
        // Get transaction history
        const allTransactions = portfolioWithGrowth.map((portfolio) => portfolio.orders.filter((order) => order.executed));
        const sortedTransactions = allTransactions.flat().sort((a, b) => Date.parse(b.timePlaced) - Date.parse(a.timePlaced));
        const fullResponse = {
            portfolios: portfolioWithGrowth,
            transactions: sortedTransactions,
        };
        res.json(fullResponse);
    } catch (err) {
        console.log(err);
        res.status(400).send(err.toString());
    }
};