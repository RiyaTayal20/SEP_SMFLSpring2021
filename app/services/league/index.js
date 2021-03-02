const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const mongoose = require('mongoose');

const userRoute = require('./routes/userRoutes');

require('dotenv').config();

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, () => console.log('connected to db'));

app.use(bodyParser.json());

app.use('/user', userRoute);

app.listen(process.env.PORT, () => console.log(`Running on port ${process.env.PORT}`));