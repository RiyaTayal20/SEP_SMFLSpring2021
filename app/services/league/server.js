const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoute = require('./routes/userRoutes');
const tradeRoute = require('./routes/tradeRoutes');
const leagueRoute = require('./routes/leagueRoutes');
const tooltipRoute = require('./routes/tooltipRoutes');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/user', userRoute);
app.use('/trade', tradeRoute);
app.use('/league', leagueRoute);
app.use('/tooltips', tooltipRoute);

module.exports = app;