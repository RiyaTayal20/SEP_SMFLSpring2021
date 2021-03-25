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
