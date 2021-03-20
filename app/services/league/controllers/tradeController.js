const Order = require('../models/orderModel');

exports.trade = async (req, res) => {
    const order = new Order({
        orderType: req.body.orderType,
        portfolioId: req.body.portfolioId,
        tickerSymbol: req.body.tickerSybmol,
        quantity: req.body.quantity,
        pricePerShare: req.body.pricePerShare,
        expiryDate: req.body.expiryDate, // Maybe add function to handle common intervals
        executed: false,
        activeLimitOrder: 
    });
};
