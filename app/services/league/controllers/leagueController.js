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

exports.authorizeLeague = async (req, res, next) => {
    const { _id: leagueID, leagueKey } = res.locals.league;

    await League.findById(
        leagueID,
        (err) => {
            if (err) throw err;
        },
    ).then((result) => {
        if (result.settings[0].endDate.getTime() < Date.now()) return res.status(400).send('Error: You tried to join an already expired league');
        if (!result.settings.public) {
            if (!(leagueKey === req.body.leagueKey)) return res.status(400).send('Error: You tried to join a private league with an invalid key');
        }
        next();
    });
};

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
    const { _id } = res.locals.league;
    const { username } = res.locals;

    addPlayerToLeague(username, _id)
        .then((succ) => {
            if (!res.locals.league.playerList.includes(username)) {
                return res.send(`Sucessfully joined league! (${req.body.leagueName}) \n ${succ}`);
            }
            throw new Error(`Cannot join league that you are already a part of! (${req.body.leagueName}) \n`);
        })
        .catch((err) => res.status(422).send(`{${err}}`));
};

exports.leaveLeague = async (req, res) => {
    const { _id } = res.locals.league;
    const { username } = res.locals;

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
        .then((succ) => {
            if (res.locals.league.playerList.includes(username)) {
                return res.send(`Successfully left league (${req.body.leagueName})\n ${succ}`);
            }
            throw new Error(`Cannot leave league! Please make sure that you are a part of the league, (${req.body.leagueName}) before attempting to leave`);
        })
        .catch((err) => res.status(422).send(`{${err}}`));
};
