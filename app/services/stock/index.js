const mongoose = require('mongoose');
const app = require('./server');

require('dotenv').config();

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

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
