const mongoose = require('mongoose');
const app = require('./server');
const cron = require('node-cron');

const { checkOrders } = require('./tasks/orderTask');
const { addNetWorth }  = require('./tasks/netWorthTask');

require('dotenv').config();

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}, () => console.log('connected to db'));

app.listen(process.env.PORT, () => console.log(`Running on port ${process.env.PORT}`));


cron.schedule('* * * * *', () => {
    console.log('Checking orders');
    checkOrders();
});

cron.schedule('0 16 * * 1-5', () => {
    addNetWorth(); 
});
