const jwtDecode = require('jwt-decode');
const League = require('../models/leagueModel');
const User = require('../models/userModel');

const addPlayerToLeague = async (user, leagueID) => {
    Promise.all([
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
    ]).then((succ) => succ).catch((err) => {
        throw err;
    });
};

exports.createLeague = async (req, res) => {
    const decodedToken = jwtDecode(req.headers.authorization.slice(7));

    const league = new League({
        leagueName: req.body.leagueName,
        leagueManager: decodedToken.user.username,
        leagueKey: req.body.leagueKey,
        settings: req.body.settings,
    });

    try {
        const savedLeague = await league.save();
        addPlayerToLeague(decodedToken.user.username, savedLeague.id).then(() => {
            res.send(savedLeague);
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.joinLeague = async (req, res) => {
    const decodedToken = jwtDecode(req.headers.authorization.slice(7));
    console.log(decodedToken);

    addPlayerToLeague(req.body.id, req.body.username).then((succ) => {
        res.send(succ);
    }).catch((err) => res.send(err));
};
