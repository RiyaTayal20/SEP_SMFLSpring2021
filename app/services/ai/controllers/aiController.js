/** @module controllers/aiController */

const {spawn} = require('child_process');

exports.close = async (req, res) => {
    console.log('close');
    let close;
    const python = spawn('python', ['./controllers/indicators/close.py', req.params.ticker]);
    python.stdout.on('data', function (data) {    
        data = data.toString().trim();
        data = data.replace(/[\r\n]+/gm, ' ');
        data = data.split(' ');       
        data = data.filter(item => item);
        data.splice(0,3);
        close = data.filter((e, i) => i % 3 === 3 - 1);
        dataOut = data;
    });
    python.stderr.on('data', function (data){
        console.log(data.toString());
    });
    python.on('close', (code) => {
        res.send(close);
    });
};

exports.mean = async (req, res) => {
    console.log('mean');
    let smaDates, smaPrices, smaLower, smaUpper, smaClose, smaBuyers, smaSellers;
    const python = spawn('python', ['./controllers/indicators/meanGraph.py', req.params.ticker]);
    python.stdout.on('data', function (data) {
        data = data.toString().trim();
        data = data.replace(/[\r\n]+/gm, ' ');
        data = data.split(' ');
        data = data.filter(item => item);
        data.splice(0,6);
        smaSellers = data.filter((e, i) => i % 6 === 6 - 1);
        smaBuyers = data.filter((e, i) => i % 6 + 1 === 6 - 1);        
        smaUpper = data.filter((e, i) => i % 6 + 2 === 6 - 1);
        smaLower = data.filter((e, i) => i % 6 + 3 === 6 - 1);        
        smaPrices = data.filter((e, i) => i % 6 + 4 === 6 - 1);
        smaDates = data.filter((e, i) => i % 6 + 5 === 6 - 1);
    });
    python.stderr.on('data', function (data){
        console.log(data.toString());
    });
    python.on('close', (code) => {
        const meanData = {
            smaDates: smaDates,
            smaPrices: smaPrices,
            smaLower: smaLower,
            smaUpper: smaUpper,
            smaBuyers: smaBuyers,
            smaSellers: smaSellers,
        };
        res.send(meanData);
    });
};

exports.momentum = async (req, res) => {
    console.log('momentum');
    let dates, rsi, buy, sell;
    const python = spawn('python', ['./controllers/indicators/momentumGraph.py', req.params.ticker]);
    python.stdout.on('data', function (data) {
        data = data.toString().trim();
        data = data.replace(/[\r\n]+/gm, ' ');
        data = data.split(' ');
        data = data.filter(item => item);
        data.splice(0,6);
        dates = data.filter((e, i) => i % 4 + 3 === 4 - 1);
        rsi= data.filter((e, i) => i % 4 + 2=== 4 - 1);
        sell = data.filter((e, i) => i % 4 === 4 - 1);
        buy = data.filter((e, i) => i % 4 + 1 === 4 - 1);
    });
    python.stderr.on('data', function (data){
        console.log(data.toString());
    });
    python.on('close', (code) => {
        const momentumData = {
            dates: dates,
            rsi: rsi,
            buy: buy,
            sell: sell,
        };
        res.send(momentumData);
    });
};