/** @module controllers/aiController */

const {spawn} = require('child_process');

exports.close = async (req, res) => {
    let close2;
    const python = spawn('python', ['./controllers/indicators/close.py', req.params.ticker]);
    python.stdout.on('data', function (data) {    
        data = data.toString().trim();
        data = data.replace(/[\r\n]+/gm, ' ');
        data = data.split(' ');       
        data = data.filter(item => item);
        data.splice(0,3);
        close2 = data.filter((e, i) => i % 3 === 3 - 1);
        dataOut = data;
        console.log(close2);
        res.write(JSON.stringify({
            data: close2,
        }));
        res.end();
        console.log('sent close');
        console.log(close2);
    });
    python.stderr.on('data', function (data){
        console.log("data.toString()");
    });
};

exports.mean = async (req, res) => {
    let smaDates, smaPrices, smaLower, smaUpper, smaClose, smaBuyers, smaSellers;
    const python = spawn('python', ['./controllers/indicators/meanGraph.py', req.params.ticker]);
    python.stdout.on('data', function (data) {
        data = data.toString().trim();
        data = data.replace(/[\r\n]+/gm, ' ');
        data = data.split(' ');
        data = data.filter(item => item);
        data.splice(0,6);
        
        smaDates = data.filter((e, i) => i % 6 === 0);        
        smaPrices = data.filter((e, i) => i % 6 === 1);
        smaLower = data.filter((e, i) => i % 6 === 2);
        smaUpper = data.filter((e, i) => i % 6 === 3);
        smaBuyers = data.filter((e, i) => i % 6 === 4);
        smaSellers = data.filter((e, i) => i % 6 === 5);

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
        console.log('sent mean');
    });
    python.stderr.on('data', function (data){
        console.log(data.toString());
    });
    // python.on('close', (code) => {
    //     console.log('sending dates');
    //     console.log(smaDates);
    //     const meanData = JSON.stringify({
    //         smaDates: smaDates,
    //         smaPrices: smaPrices,
    //         smaLower: smaLower,
    //         smaUpper: smaUpper,
    //         smaBuyers: smaBuyers,
    //         smaSellers: smaSellers,
    //     });
    //     res.send(meanData);
    // });
};

exports.momentum = async (req, res) => {
    let dates, rsi, buy, sell;
    const python = spawn('python', ['./controllers/indicators/momentumGraph.py', req.params.ticker]);
    python.stdout.on('data', function (data) {
        data = data.toString().trim();
        data = data.replace(/[\r\n]+/gm, ' ');
        data = data.split(' ');
        data = data.filter(item => item);
        data.splice(0,6);
        sell = data.filter((e, i) => i % 4 === 4 - 1);
        buy = data.filter((e, i) => i % 4 + 1 === 4 - 1);
        rsi= data.filter((e, i) => i % 4 + 2 === 4 - 1);
        dates = data.filter((e, i) => i % 4 + 3 === 4 - 1);

        const momentumData = {
            dates: dates,
            rsi: rsi,
            buy: buy,
            sell: sell,
        };
        res.write(JSON.stringify(momentumData));
        res.end();
        console.log('sent momentum');
    });
    python.stderr.on('data', function (data){
        console.log(data.toString());
    });
};

exports.candlesticks = async (req, res) => {
    let dates, open, high, low, close, i;
    let candlesticksData = [];
    const python = spawn('python', ['./controllers/indicators/candlestickGraph.py', req.params.ticker]);
    python.stdout.on('data', function (data) {
        data = data.toString().trim();
        data = data.replace(/[\r\n]+/gm, ' ');
        data = data.split(' ');
        data = data.filter(item => item);
        data.splice(0,5);
        close = data.filter((e, i) => i % 5 === 5 - 1);
        open = data.filter((e, i) => i % 5 + 1 === 5 - 1);
        low = data.filter((e, i) => i % 5 + 2 === 5 - 1);
        high = data.filter((e, i) => i % 5 + 3 === 5 - 1);
        dates = data.filter((e, i) => i % 5 + 4 === 5 - 1);
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
        console.log('sent candlestick');
    });
    python.stderr.on('data', function (data){
        console.log(data.toString());
    });
};