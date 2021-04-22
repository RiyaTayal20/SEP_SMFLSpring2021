const Tooltip = require('../models/tooltipModel');

exports.getTooltip = async(req, res) => {
    await Tooltip.findOne({ term: req.params.term }, (err, result) => {
        if (err) throw err;
        if (!result) res.status(404).send('Tooltip not found');
        else res.send(result);
    });  
};

exports.getTooltips = async (req, res) => {
    await Tooltip.find({}, (err, result) => {
        if (err) throw err;
        else res.send(result.reduce((obj, { term, definition, url }) => (obj[term] = { definition, url }, obj), {}));
    });
}