const fetch = require('node-fetch');

exports.getMarketPrice = async (ticker) => {
    try {
        const currPrice = await fetch(`${process.env.STOCK_URL}/equity/current/${ticker}`)
            .then((response) => response.json());
        return currPrice;
    } catch (err) {
        console.error(err);
    }
};

exports.getStatistics = async (ticker) => {
    try {
        const statistics = await fetch(`${process.env.STOCK_URL}/equity/statistics/${ticker}`)
            .then((response) => response.json());
        return statistics;
    } catch (err) {
        console.error(err);
    }
};
