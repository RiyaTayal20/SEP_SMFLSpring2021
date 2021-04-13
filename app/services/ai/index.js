const app = require('./server');
const {spawn} = require('child_process');

const PORT = process.env.PORT || 3005;

var rating;
const python = spawn('python', ['momentum.py']);

python.stdout.on('data', function (data) {
    rating = data.toString();
});

python.on('close', (code) => {
    console.log(rating);
    if (rating === 'Buy') {
        console.log('hi');
    } else {
        console.log('bye');
    }

});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));