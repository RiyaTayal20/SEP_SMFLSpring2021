const League = require('../models/leagueModel');

exports.createLeague = async(req, res) => {
    const league = new League({
        leagueName: req.body.leagueName,
        leagueID: req.body.leagueID,
        leagueManager: req.body.username,
        settings: req.body.settings,
        //other stuff??
    });
    try {
        const savedLeague = await league.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
}