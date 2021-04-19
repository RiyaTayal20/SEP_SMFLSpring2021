const cheerio = require('cheerio');
const fetch = require('node-fetch');
const Tooltip = require('../models/tooltipModel');

exports.scrapeWebsite = async (req, res) => {
    const terms = req.body.terms;
    
    for (const term of terms) {
        const url = `https://www.investopedia.com/terms/${term[0]}/${term}.asp`;
        const htmlBody = await fetch(url)
                        .then((res) => res.text());
        const $ = cheerio.load(htmlBody);
        $.html();
        
        const definition = $('#mntl-sc-block_1-0-1').text();

        const tooltip = new Tooltip({
            term: term,
            definition: definition.trim(),
            url: url,
        });

        await tooltip.save();
    }

    res.send('Successfully saved tooltips.');
}

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