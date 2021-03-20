const League = require('../models/leagueModel');
const User = require('../models/userModel');

const addPlayerToLeague = async (user, leagueID) => Promise.all([
    await League.findByIdAndUpdate(
        leagueID,
        { $addToSet: { playerList: user } },
        { upsert: true, new: true },
        (err) => {
            if (err) throw err;
        },
    ),
    await User.findOneAndUpdate(
        { username: user },
        { $addToSet: { leagues: leagueID } },
        { upsert: true, new: true },
        (err) => {
            if (err) throw err;
        },
    ),
]);

exports.createLeague = async (req, res) => {
    const user = res.locals.username;
    const league = new League({
        leagueName: req.body.leagueName,
        leagueManager: user,
        leagueKey: req.body.leagueKey,
        settings: req.body.settings,
    });

    try {
        const savedLeague = await league.save();
        addPlayerToLeague(user, savedLeague.id).then(() => {
            res.send(savedLeague);
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.joinLeague = async (req, res) => {
    const { leagueName } = req.body;
    try {
        const leagueID = await League.findOne({ leagueName })
            .then((league) => league._id)
            .catch(() => { throw new Error(`Cannot find league named ${leagueName}`); });

        const test = addPlayerToLeague(res.locals.username, leagueID);
        test.then((succ) => {
            res.send(succ);
        });
    } catch (err) {
        return res.status(422).send(`{${err}}`);
    }
};
