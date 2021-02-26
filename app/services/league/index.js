const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const mongoose = require('mongoose');

const userRouter = require('./routes/user.routes');

require('dotenv').config();

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, () => console.log('connected to db'));

app.use(bodyParser.json());

app.use('/user', userRouter);

app.listen(process.env.PORT, () => console.log(`Running on port ${process.env.PORT}`));
