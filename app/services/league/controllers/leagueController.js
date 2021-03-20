const League = require('../models/leagueModel');
const User = require('../models/userModel');

const addPlayerToLeague = async (user, leagueID) => Promise.all([
    await League.findByIdAndUpdate(
        leagueID,
        { $addToSet: { playerList: user } },
        { new: true },
        (err) => {
            if (err) throw err;
        },
    ),
    await User.findOneAndUpdate(
        { username: user },
        { $addToSet: { leagues: leagueID } },
        { new: true },
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
    const { _id } = res.locals.league;
    const { username } = res.locals;

    addPlayerToLeague(username, _id)
        .then((succ) => res.send(succ))
        .catch((err) => res.status(422).send(`{${err}}`));
};
