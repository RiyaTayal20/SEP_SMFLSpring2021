const { response } = require('express');
const fetch = require('node-fetch');
const News = require("../models/newsModel.js");
require('dotenv').config();

const CACHE_TIME = 60;

const getNews = async (ticker) => {
    try {
        const news = await News.findOne({tickerSymbol: ticker});
        //
        const response = await fetch(`https://cloud.iexapis.com/stable/stock/${ticker}/news?token=${process.env.API_KEY}`);
        const newsData = await response.json();

        //Save to database
        const updatedNews = await News.findOneAndRemove(
            {tickerSymbol: ticker},
            { $set: {
                tickerSymbol : ticker,
                headline : newsData.headline,
                image: newsData.image,
                url : newsData.url,
                date : newsData.datetime}
            },
            { 
                new: true,
                upsert: true,
            },
        );
        return updatedNews;
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
    response.send(newsInfo);
};