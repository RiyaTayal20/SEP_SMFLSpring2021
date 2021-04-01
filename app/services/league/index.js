const mongoose = require('mongoose');
const app = require('./server');

require('dotenv').config();

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}, () => console.log('connected to db'));

app.listen(process.env.PORT, () => console.log(`Running on port ${process.env.PORT}`));
