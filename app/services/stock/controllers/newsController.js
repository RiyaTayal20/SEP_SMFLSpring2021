const fetch = require('node-fetch');
const News = require("../models/newsModel.js");

const CACHE_TIME = 60;

const getNews = async (ticker) => {
    try {
        const news = await News.findOne({tickerSymbol: ticker});
        const response = await fetch(`https://cloud.iexapis.com/stable/stock/${ticker}/news/last/50?token=${process.env.API_KEY}`);
        const newsData = await response.json();

        const extractedArticles = newsData.map((article) => {
            return {
                headline: article.headline,
                image: article.image,
                url: article.url,
                date: new Date(article.datetime),
            }
        });

        console.log(extractedArticles);

        const updatedNews = await News.findOneAndUpdate(
            { tickerSymbol: ticker },
            { $set: 
                {
                    articles: extractedArticles,
                    lastUpdated: new Date(),
                }
            },
            { 
                new: true,
                upsert: true,
            },
        );
    } catch (err) {
        console.error(err);
        return err;
    }
};

exports.news = async (request, response) => {
    const news = await getNews(request.params.ticker)
    .catch((err) => {
        console.error(err);
        response.status(400).send(err);
    });
    response.send(news);
};
