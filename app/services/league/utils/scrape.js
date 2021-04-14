const cheerio = require('cheerio');
const fetch = require('node-fetch');

scrapeWebsite = async () => {
    const terms = ['previousclose', 'openingprice', 'volume', 'averagedailytradingvolume', 'marketcapitalization', 'beta', 'price-earningsratio', 'eps', 'earnings-announcement', ]
    const htmlBody = await fetch('https://www.investopedia.com/terms/p/previousclose.asp')
                        .then((res) => res.text());
    
    const $ = cheerio.load(htmlBody);
    $.html();

    console.log($('#mntl-sc-block_1-0-1').text());
    return ($('#mntl-sc-block_1-0-1').text());
}

scrapeWebsite((result) => console.log('hello'));