const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const app = express();
const mongoose = require('mongoose');

const userRouter = require('./routes/userRoutes');

require('dotenv').config();

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, () => console.log('connected to db'));

app.use(bodyParser.json());
app.use(session({
    secret: 'rocket emoji',
    resave: false,
    saveUninitialized: true,
}));

app.use(cookieParser('rocket emoji'));
app.use(passport.initialize());
app.use(passport.session());

app.use('/user', userRouter);

app.listen(process.env.PORT, () => console.log(`Running on port ${process.env.PORT}`));
