const League = require('../models/leagueModel');

exports.createLeague = async (req, res) => {
    const league = new League({
        leagueName: req.body.leagueName,
        leagueCode: req.body.leagueCode,
        settings: req.body.settings,
    });
    try {
        const savedLeague = await league.save();
        res.send(savedLeague);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.joinLeague = async (req, res) => {
    await League.findByIdAndUpdate(
        req.body.id,
        { $addToSet: { playerList: req.body.user } },
        { upsert: true, new: true },
        (err, succ) => {
            if (err) throw err;
            res.send(succ);
        },
    );
};
