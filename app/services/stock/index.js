const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const stockRoute = require('./routes/stockRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false,
        });
        console.log('Successfully connected to database');
    } catch (err) {
        console.error('Failed to connect to database');
    }
};

connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use('/equity', stockRoute);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
