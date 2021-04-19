const cheerio = require('cheerio');
const fetch = require('node-fetch');
const Tooltip = require('../models/tooltipModel');

exports.scrapeWebsite = async () => {
    const terms = ['previousclose', 'openingprice', 'volume', 'averagedailytradingvolume', 'marketcapitalization', 'beta', 'price-earningsratio', 'eps', 'earnings-announcement', 'costbasis'];
    
    for (const term of terms) {
        const url = `https://www.investopedia.com/terms/${term[0]}/${term}.asp`;
        const htmlBody = await fetch(url)
                        .then((res) => res.text());
        const $ = cheerio.load(htmlBody);
        $.html();
        
        const definition = $('#mntl-sc-block_1-0-1').text();

        const tooltip = new Tooltip({
            term: term,
            definition: definition,
            url: url,
        });

        return tooltip;
    }
}