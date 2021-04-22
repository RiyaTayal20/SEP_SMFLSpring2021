/** @module controllers/aiController */

const {spawn} = require('child_process');

exports.close = async (req, res) => {
    let close2 = [];
    let read = [];
    const python = spawn('python', ['./controllers/indicators/close.py', req.params.ticker]);
    python.stdout.on('data', (data) => {    
        data = data.toString().trim();
        data = data.replace(/[\r\n]+/gm, ' ');
        data = data.split(' ');       
        data = data.filter(item => item);
        read = read.concat(data);
    });
    python.stderr.on('data', function (data){
        console.log("data.toString()");
    });
    python.on('close', (code) => {
        read.splice(0,3);
        close2 = read.filter((e, i) => i % 3 === 3 - 1);
        console.log('sent close');
        res.write(JSON.stringify({
            data: close2,
        }));
        res.end();
    });
};

exports.mean = async (req, res) => {
    let smaDates=[], smaPrices=[], smaLower=[], smaUpper=[], smaClose=[], smaBuyers=[], smaSellers=[];
    let read = [];
    const python = spawn('python', ['./controllers/indicators/meanGraph.py', req.params.ticker]);
    python.stdout.on('data', function (data) {
        data = data.toString().trim();
        data = data.replace(/[\r\n]+/gm, ' ');
        data = data.split(' ');
        data = data.filter(item => item);
        read = read.concat(data);
    });
    python.stderr.on('data', function (data){
        console.log(data.toString());
    });
    python.on('close', (code) => {
        read.splice(0,6);
        
        smaDates = read.filter((e, i) => i % 6 === 0);        
        smaPrices = read.filter((e, i) => i % 6 === 1);
        smaLower = read.filter((e, i) => i % 6 === 2);
        smaUpper = read.filter((e, i) => i % 6 === 3);
        smaBuyers = read.filter((e, i) => i % 6 === 4);
        smaSellers = read.filter((e, i) => i % 6 === 5);

        const meanData = {
            smaDates: smaDates,
            smaPrices: smaPrices,
            smaLower: smaLower,
            smaUpper: smaUpper,
            smaBuyers: smaBuyers,
            smaSellers: smaSellers,
        };
        res.write(JSON.stringify(meanData));
        res.end();
        // console.log('sent mean');
    });
};

exports.momentum = async (req, res) => {
    let dates = [], rsi = [], buy =[], sell=[];
    let read = [];
    const python = spawn('python', ['./controllers/indicators/momentumGraph.py', req.params.ticker]);
    python.stdout.on('data', function (data) {
        data = data.toString().trim();
        data = data.replace(/[\r\n]+/gm, ' ');
        data = data.split(' ');
        data = data.filter(item => item);
        read = read.concat(data);
    });
    python.stderr.on('data', function (data){
        console.log(data.toString());
    });
    python.on('close', (code) => {
        read.splice(0,6);
        sell = read.filter((e, i) => i % 4 === 4 - 1);
        buy = read.filter((e, i) => i % 4 + 1 === 4 - 1);
        rsi= read.filter((e, i) => i % 4 + 2 === 4 - 1);
        dates = read.filter((e, i) => i % 4 + 3 === 4 - 1);
        const momentumData = {
            dates: dates,
            rsi: rsi,
            buy: buy,
            sell: sell,
        };
        res.write(JSON.stringify(momentumData));
        res.end();
        // console.log('sent momentum');
    });
};

exports.candlesticks = async (req, res) => {
    let dates =[], open=[], high=[], low=[], close=[];
    let candlesticksData = [];
    let read = [];
    const python = spawn('python', ['./controllers/indicators/candlestickGraph.py', req.params.ticker]);
    python.stdout.on('data', function (data) {
        data = data.toString().trim();
        data = data.replace(/[\r\n]+/gm, ' ');
        data = data.split(' ');
        data = data.filter(item => item);
        read = read.concat(data);
    });
    python.stderr.on('data', function (data){
        console.log(data.toString());
    });
    python.on('close', (code) => {
        read.splice(0,5);
        close = read.filter((e, i) => i % 5 === 5 - 1);
        open = read.filter((e, i) => i % 5 + 1 === 5 - 1);
        low = read.filter((e, i) => i % 5 + 2 === 5 - 1);
        high = read.filter((e, i) => i % 5 + 3 === 5 - 1);
        dates = read.filter((e, i) => i % 5 + 4 === 5 - 1);
        for (i = 0; i < open.length; i++) {
            let ohlc = [parseFloat(open[i]).toFixed(2), parseFloat(high[i]).toFixed(2), parseFloat(low[i]).toFixed(2), parseFloat(close[i]).toFixed(2)];
            const temp = {
                x: dates[i],
                y: ohlc,
            }
            candlesticksData.push(temp);
        }
        res.write(JSON.stringify({
            data: candlesticksData,
        }));
        res.end();
        // console.log('sent candlestick');
    });
    
};