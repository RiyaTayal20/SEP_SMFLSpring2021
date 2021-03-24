const League = require('../models/leagueModel');
const User = require('../models/userModel');

const addPlayerToLeague = async (user, leagueID) => Promise.all([
    await League.findByIdAndUpdate(
        leagueID,
        { $addToSet: { playerList: user } },
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
