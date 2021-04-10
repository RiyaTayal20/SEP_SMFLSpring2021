const app = require('./server');
const {spawn} = require('child_process');

const PORT = process.env.PORT || 3005;

app.get('/', (req, res) => {
    var dataToSend;
    // spawn new child process to call the python script
    const python = spawn('python', ['momentum.py']);

    python.stdout.on('data', function (data) {
        dataToSend = data.toString();
    });

    python.on('close', (code) => {
        console.log(dataToSend);
        // res.send(dataToSend)
    });
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));