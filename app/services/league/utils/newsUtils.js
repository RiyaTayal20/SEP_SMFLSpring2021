const fetch = require('node-fetch');

exports.getNews = async (ticker) => {
    try {
        const news = await fetch(`${process.env.STOCK_URL}/news/newsInfo/${ticker}`)
            .then((response) => response.json());
        return news;
    } catch (err) {
        console.error(err);
    }
};
