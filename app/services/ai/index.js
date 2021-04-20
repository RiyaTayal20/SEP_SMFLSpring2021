const app = require('./server');
const cron = require('node-cron');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const { aiBots }  = require('./tasks/aiTask');

cron.schedule('*/2 10-16 * * 1-5', () => {
    console.log('AI bots');
    aiBots();
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
