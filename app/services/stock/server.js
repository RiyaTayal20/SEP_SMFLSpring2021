const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const stockRoute = require('./routes/equityRoutes.js');
const newsRoute = require('./routes/newsRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/equity', stockRoute);
app.use('/news', newsRoute);

module.exports = app;