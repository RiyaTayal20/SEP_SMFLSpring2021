const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const mongoose = require('mongoose');

const userRoute = require('./routes/userRoutes');
const leagueRoute = require('./routes/leagueRoutes');

require('dotenv').config();

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}, () => console.log('connected to db'));

app.use(bodyParser.json());
app.use(cors());

app.use('/user', userRoute);

app.use('/league', leagueRoute);

app.listen(process.env.PORT, () => console.log(`Running on port ${process.env.PORT}`));
