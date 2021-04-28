import { React, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import ReactApexChart from 'react-apexcharts';
import '../../styles/Ai/Ai.scss';

function AIPage() {
    /* eslint-disable */
    const history = useHistory();
    const ticker = history.location.state.tickerSymbol;
    const [close, setClose] = useState('');
    const [candlesticks, setCandlesticks] = useState([]);
    const [mean, setMean] = useState({
        smaDates: '',
        smaPrices: '',
        smaLower: '',
        smaUpper: '',
        smaBuyers: '',
        smaSellers: '',
    });
    const [momentum, setMomentum] = useState({
        dates: '',
        rsi: '',
        buy: '',
        sell: '',
    });
    const series = [{
        data: [{
            "x":"2021-01-25",
            "y":["143.07","145.09","136.54","142.92"]
        },
        {
            "x":"2021-01-26",
            "y":["143.60","144.30","141.37","143.16"]
        },
        {
            "x":"2021-01-27",
            "y":["143.43","144.30","140.41","142.06"]
        },
        {
            "x":"2021-01-28",
            "y":["139.52","141.99","136.70","137.09"]
        },
        {
            "x":"2021-01-29",
            "y":["135.83","136.74","130.21","131.96"]
        },
        {
            "x":"2021-02-01",
            "y":["133.75","135.38","130.93","134.14"]
        },
        {
            "x":"2021-02-02",
            "y":["135.73","136.31","134.61","134.99"]
        },
        {
            "x":"2021-02-03",
            "y":["135.76","135.77","133.61","133.94"]
        },
        {
            "x":"2021-02-04",
            "y":["136.30","137.40","134.59","137.39"]
        },
        {"x":"2021-02-05","y":["137.35","137.42","135.86","136.76"]},{"x":"2021-02-08","y":["136.03","136.96","134.92","136.91"]},{"x":"2021-02-09","y":["136.62","137.88","135.85","136.01"]},{"x":"2021-02-10","y":["136.48","136.99","134.40","135.39"]},{"x":"2021-02-11","y":["135.90","136.39","133.77","135.13"]},{"x":"2021-02-12","y":["134.35","135.53","133.69","135.37"]},{"x":"2021-02-16","y":["135.49","136.01","132.79","133.19"]},{"x":"2021-02-17","y":["131.25","132.22","129.47","130.84"]},{"x":"2021-02-18","y":["129.20","130.00","127.41","129.71"]},{"x":"2021-02-19","y":["130.24","130.71","128.80","129.87"]},{"x":"2021-02-22","y":["128.01","129.72","125.60","126.00"]},{"x":"2021-02-23","y":["123.76","126.71","118.39","125.86"]},{"x":"2021-02-24","y":["124.94","125.56","122.23","125.35"]},{"x":"2021-02-25","y":["124.68","126.46","120.54","120.99"]},{"x":"2021-02-26","y":["122.59","124.85","121.20","121.26"]},{"x":"2021-03-01","y":["123.75","127.93","122.79","127.79"]},{"x":"2021-03-02","y":["128.41","128.72","125.01","125.12"]},{"x":"2021-03-03","y":["124.81","125.71","121.84","122.06"]},{"x":"2021-03-04","y":["121.75","123.60","118.62","120.13"]},{"x":"2021-03-05","y":["120.98","121.94","117.57","121.42"]},{"x":"2021-03-08","y":["120.93","121.00","116.21","116.36"]},{"x":"2021-03-09","y":["119.03","122.06","118.79","121.09"]},{"x":"2021-03-10","y":["121.69","122.17","119.45","119.98"]},{"x":"2021-03-11","y":["122.54","123.21","121.26","121.96"]},{"x":"2021-03-12","y":["120.40","121.17","119.16","121.03"]},{"x":"2021-03-15","y":["121.41","124.00","120.42","123.99"]},{"x":"2021-03-16","y":["125.70","127.22","124.72","125.57"]},{"x":"2021-03-17","y":["124.05","125.86","122.34","124.76"]},{"x":"2021-03-18","y":["122.88","123.18","120.32","120.53"]},{"x":"2021-03-19","y":["119.90","121.43","119.68","119.99"]},{"x":"2021-03-22","y":["120.33","123.87","120.26","123.39"]},{"x":"2021-03-23","y":["123.33","124.24","122.14","122.54"]},{"x":"2021-03-24","y":["122.82","122.90","120.07","120.09"]},{"x":"2021-03-25","y":["119.54","121.66","119.00","120.59"]},{"x":"2021-03-26","y":["120.35","121.48","118.92","121.21"]},{"x":"2021-03-29","y":["121.65","122.58","120.73","121.39"]},{"x":"2021-03-30","y":["120.11","120.40","118.86","119.90"]},{"x":"2021-03-31","y":["121.65","123.52","121.15","122.15"]},{"x":"2021-04-01","y":["123.66","124.18","122.49","123.00"]},{"x":"2021-04-05","y":["123.87","126.16","123.07","125.90"]},{"x":"2021-04-06","y":["126.50","127.13","125.65","126.21"]},{"x":"2021-04-07","y":["125.83","127.92","125.14","127.90"]},{"x":"2021-04-08","y":["128.95","130.39","128.52","130.36"]},{"x":"2021-04-09","y":["129.80","133.04","129.47","133.00"]},{"x":"2021-04-12","y":["132.52","132.85","130.63","131.24"]},{"x":"2021-04-13","y":["132.44","134.66","131.93","134.43"]},{"x":"2021-04-14","y":["134.94","135.00","131.66","132.03"]},{"x":"2021-04-15","y":["133.82","135.00","133.64","134.50"]},{"x":"2021-04-16","y":["134.30","134.67","133.28","134.16"]},{"x":"2021-04-19","y":["133.51","135.47","133.34","134.84"]},{"x":"2021-04-20","y":["135.02","135.53","131.81","133.11"]},{"x":"2021-04-21","y":["132.36","133.75","131.30","133.50"]},{"x":"2021-04-22","y":["133.04","134.15","131.41","131.94"]}
        ]
    }];
    const options = {
        chart: {
            type: 'candlestick',
            height: 350,
        },
        tooltip: {
            enabled: true,
            theme: false,
        },
        xaxis: {
            title: {
                text: 'Date',
                style: {
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 800,
                    cssClass: 'apexcharts-yaxis-title',
                },
            },
            type: 'datetime',
            labels: {
                show: true,
                style: {
                    colors: 'white',
                    fontSize: 14,
                    cssClass: 'apexcharts-xaxis-label',
                },
            },
        },
        yaxis: {
            title: {
                text: 'Price',
                style: {
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 800,
                    cssClass: 'apexcharts-yaxis-title',
                },
            },
            labels: {
                show: true,
                style: {
                    colors: 'white',
                    fontSize: 14,
                    cssClass: 'apexcharts-yaxis-label',
                },
            },
            axisTicks: {
                show: true,
                color: 'white',
            },
            min: 114,
            max: 145,
        },
    };
    const getCandlesticks = async () => {
        const response = await fetch(`http://localhost:5002/ai/candlesticks/${ticker}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        const arrayJ = await response.json();
        const { data } = arrayJ;
        setCandlesticks(data);
    };
    const getClose = async () => {
        const response = await fetch(`http://localhost:5002/ai/close/${ticker}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        const arrayJ = await response.json();
        const { data } = arrayJ;
        setClose(data);
    };
    const getMean = async () => {
        const response = await fetch(`http://localhost:5002/ai/mean/${ticker}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setMean({
            smaDates: data.smaDates,
            smaPrices: data.smaPrices,
            smaUpper: data.smaUpper,
            smaLower: data.smaLower,
            smaBuyers: data.smaBuyers,
            smaSellers: data.smaSellers,
        });
    };
    const getMomentum = async () => {
        const response = await fetch(`http://localhost:5002/ai/momentum/${ticker}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setMomentum({
            dates: data.dates,
            rsi: data.rsi,
            buy: data.buy,
            sell: data.sell,
        });
    };
    useEffect(() => {
        getClose();
        getMean();
        getMomentum();
        getCandlesticks();
    }, []);
    return (
        <div className="ai-container">
            <div className="ai-header">
                <h1>AI Player Algorithms</h1>
                <h4>The AI players will utilize the following algorithms and technical indicators when placing trades.</h4>
            </div>
            <div className="algorithms">
                <div className="mean">
                    <h1><b>Mean Reversion</b></h1>
                    <div className="meanGraph">
                        <Line
                            data={{
                                labels: mean.smaDates, // all x values
                                datasets: [
                                    {
                                        label: 'Buy',
                                        data: mean.smaBuyers, // all y values
                                        borderColor: 'rgba(76, 235, 52, 1)',
                                        pointBackgroundColor: 'rgba(76, 235, 52, 1)',
                                        hoverBackgroundColor: 'blue',
                                        pointRadius: 7,
                                        pointStyle: 'triangle',
                                        borderWidth: 3,
                                        fill: false,
                                        lineTension: 0.1,
                                    },
                                    {
                                        label: 'Sell',
                                        data: mean.smaSellers, // all y values
                                        borderColor: 'red',
                                        pointBackgroundColor: 'red',
                                        hoverBackgroundColor: 'blue',
                                        pointStyle: 'triangle',
                                        rotation: 180,
                                        pointRadius: 7,
                                        borderWidth: 3,
                                        fill: false,
                                        lineTension: 0.1,
                                    },
                                    {
                                        label: 'Upper Band',
                                        data: mean.smaUpper, // all y values
                                        borderColor: 'rgba(141, 158, 145, 1)',
                                        pointRadius: 0,
                                        hoverBackgroundColor: 'blue',
                                        fill: false,
                                        borderWidth: 2,
                                        lineTension: 0.1,
                                    },
                                    {
                                        label: 'Close',
                                        data: close, // all y values
                                        borderColor: 'rgba(185, 23, 255, 1)',
                                        pointRadius: 0,
                                        hoverBackgroundColor: 'blue',
                                        fill: false,
                                        borderWidth: 2,
                                        lineTension: 0.1,
                                    },
                                    {
                                        label: 'SMA',
                                        data: mean.smaPrices, // all y values
                                        borderColor: 'rgba(240, 203, 84, 1)',
                                        hoverBackgroundColor: 'blue',
                                        pointRadius: 0,
                                        fill: false,
                                        borderWidth: 3,
                                        lineTension: 0.1,
                                    },
                                    {
                                        label: 'Lower Band',
                                        data: mean.smaLower, // all y values
                                        borderColor: 'rgba(141, 158, 145, 1)',
                                        pointRadius: 0,
                                        hoverBackgroundColor: 'blue',
                                        fill: false,
                                        borderWidth: 2,
                                        lineTension: 0.1,
                                    },
                                ],
                            }}
                            height={400}
                            width={600}
                            options={{
                                backgroundColor: 'white',
                                maintainAspectRatio: false,
                                tooltips: {
                                    backgroundColor: 'blue',
                                    titleFontSize: 16,
                                    bodyFontSize: 16,
                                },
                                interaction: {
                                    mode: 'point',
                                },
                                scales: {
                                    yAxes: [{
                                        gridLines: {
                                            color: 'gray',
                                            zeroLineColor: 'white',
                                        },
                                        scaleLabel: {
                                            display: true,
                                            fontSize: 20,
                                            fontColor: 'white',
                                            fontStyle: 'bold',
                                            labelString: 'Price',
                                        },
                                        ticks: {
                                            fontColor: 'white',
                                        },
                                    }],
                                    xAxes: [{
                                        gridLines: {
                                            color: 'gray',
                                            zeroLineColor: 'white',
                                        },
                                        scaleLabel: {
                                            display: true,
                                            fontSize: 20,
                                            fontColor: 'white',
                                            fontStyle: 'bold',
                                            labelString: 'Date',
                                        },
                                        ticks: {
                                            fontColor: 'white',
                                        },
                                    }],
                                },
                                legend: {
                                    labels: {
                                        fontSize: 15,
                                        fontColor: 'white',
                                    },
                                },
                            }}
                        />
                    </div>
                    <h4>Mean reversion is rooted in the belief that the prices will eventually revert to the mean of the historic data and even out over time. When implementing this strategy, the bot is attracted to prices that stray away from historical averages. Our AI bots make use of technical indicators such as the Bollinger Bands, which encompass both the Simple Moving Average (SMA) and standard deviations. These indicators find good levels to enter and exit trades, which can be seen through the red and green triangles in the graph above. The Bollinger Bands are comprised of three trend lines: a lower band, a middle band and an upper band. The middle band represents the SMA over a 14 day period, while the upper and lower bands are plotted two standard deviations away from the SMA. Any time the current price of the stock drops below the lower band, it indicates an oversold condition prompting the bot to buy into a position in that equity. Likewise, any time the price breaks above the upper band, it indicates an overbought position prompting the bot to take profits and sell out of its position.   <b><a href="https://www.investopedia.com/terms/b/bollingerbands.asp">Read More</a></b></h4>
                </div>
                <div className="momentum">
                    <h1><b>Momentum Trading</b></h1>
                    <div className="momentumGraph">
                        <Line
                            data={{
                                labels: momentum.dates,
                                datasets: [
                                    {
                                        label: 'Buy',
                                        data: momentum.buy,
                                        borderColor: 'rgba(0, 255, 4, 1)',
                                        pointBackgroundColor: 'rgba(70, 255, 4, 1)',
                                        hoverBackgroundColor: 'blue',
                                        pointStyle: 'triangle',
                                        fill: false,
                                        pointRadius: 7,
                                        borderWidth: 2,
                                        lineTension: 0.1,
                                    },
                                    {
                                        label: 'Sell',
                                        data: momentum.sell,
                                        borderColor: 'red',
                                        pointBackgroundColor: 'red',
                                        hoverBackgroundColor: 'blue',
                                        pointStyle: 'triangle',
                                        rotation: 180,
                                        fill: false,
                                        pointRadius: 7,
                                        borderWidth: 2,
                                        lineTension: 0.1,
                                    },
                                    {
                                        label: 'RSI',
                                        data: momentum.rsi,
                                        borderColor: 'rgba(185, 23, 255, 1)',
                                        hoverBackgroundColor: 'blue',
                                        pointRadius: 0,
                                        fill: false,
                                        borderWidth: 3,
                                        lineTension: 0.1,
                                    },
                                ],
                            }}
                            height={400}
                            width={600}
                            options={{
                                backgroundColor: 'white',
                                maintainAspectRatio: false,
                                tooltips: {
                                    backgroundColor: 'blue',
                                    titleFontSize: 16,
                                    bodyFontSize: 16,
                                },
                                scales: {
                                    yAxes: [{
                                        gridLines: {
                                            color: 'gray',
                                            zeroLineColor: 'white',
                                        },
                                        scaleLabel: {
                                            display: true,
                                            fontSize: 20,
                                            fontColor: 'white',
                                            fontStyle: 'bold',
                                            labelString: 'RSI Value',
                                        },
                                        ticks: {
                                            fontColor: 'white',
                                        },
                                    }],
                                    xAxes: [{
                                        gridLines: {
                                            color: 'gray',
                                            zeroLineColor: 'white',
                                        },
                                        scaleLabel: {
                                            display: true,
                                            fontSize: 20,
                                            fontColor: 'white',
                                            fontStyle: 'bold',
                                            labelString: 'Date',
                                        },
                                        ticks: {
                                            fontColor: 'white',
                                        },
                                    }],
                                },
                                legend: {
                                    labels: {
                                        fontSize: 14,
                                        fontColor: 'white',
                                    },
                                },
                            }}
                        />
                    </div>
                    <h4>Momentum trading is a strategy that takes advantage of an upwards or downwards trend in an equity’s price. It is rooted in the belief that trends that head in one direction will continue to head in that direction because of the momentum already behind them. When implementing this strategy, the bots are attracted to equities that are currently rising and sell them when they believe they have peaked. Our AI bots make use of technical indicators such as the relative strength index (RSI) and volume. The RSI is a momentum indicator that analyzes recent changes in price movements for a particular equity and determines an overbought or oversold condition for it. When the RSI is 30 or below, it indicates an oversold condition prompting the bot to buy into a position in that equity. Likewise, when the RSI is 70 or above, it indicates an overbought condition prompting the bot to take profits and sell out of this position.   <b><a href="https://www.investopedia.com/terms/r/rsi.asp">Read More</a></b></h4>
                </div>
                <div className="candlesticks">
                    <h1><b>Japanese Candlesticks</b></h1>
                    <div className="candlestickGraph">
                        <ReactApexChart
                            options={options}
                            series={series}
                            type="candlestick"
                            height={350}
                        />
                    </div>
                    <h4>Candlestick charts help investors keep track of price movements over time. Every candlestick consists of a rectangular body and two wicks on either end. Each candlestick represents one day’s worth of price data for a stock: the opening price, the closing price, the lowest price of the day and the highest price of the day. The color of the central rectangle is determined by if the price fell after open or rose. Green candlesticks are bullish and indicate buying pressure, while red candlesticks are bearish and indicate selling pressure. Our bots identify patterns in these candlesticks over time to estimate support and resistance levels, as well as the proper time to enter and exit trades. When the most popular bullish candlestick patterns are detected, the bots are prompted to buy shares of a stock. Likewise, when the most popular bearish patterns are identified, the bots are prompted to sell out of a position.   <b><a href="https://www.investopedia.com/articles/active-trading/062315/using-bullish-candlestick-patterns-buy-stocks.asp">Read More</a></b></h4>
                </div>
            </div>
        </div>
    );
}

export default AIPage;