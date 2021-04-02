const League = require('../models/leagueModel');

exports.authorizeLeague = async (req, res, next) => {
    const { _id: leagueID, leagueKey } = res.locals.league;

    await League.findById(
        leagueID,
        (err) => {
            if (err) throw err;
        },
    ).then((result) => {
        if (result.settings.endDate < Date.now()) return res.status(400).send('Error: You tried to join an already expired league');
        if (!result.settings.public) {
            if (!(leagueKey === req.body.leagueKey)) return res.status(400).send('Error: You tried to join a private league with an invalid key');
        }
        next();
    });
};
