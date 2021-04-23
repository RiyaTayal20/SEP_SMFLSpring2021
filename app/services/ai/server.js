const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const aiRoute = require('./routes/aiRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/ai', aiRoute);

module.exports = app;