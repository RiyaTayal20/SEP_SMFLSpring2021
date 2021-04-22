import { React, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import ReactApexChart from 'react-apexcharts';
import '../../styles/Ai/Ai.scss';

function AIPage() {
    /* eslint-disable max-len */
    const history = useHistory();
    const ticker = history.location.state.tickerSymbol;
    const [close, setClose] = useState('');
    const [candlesticks, setCandlesticks] = useState('');
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
        data: candlesticks,
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
        },
    };
    const getCandlesticks = async () => {
        const response = await fetch(`${process.env.REACT_APP_AAPI_URL}/ai/candlesticks/${ticker}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setCandlesticks(data);
    };
    const getClose = async () => {
        const response = await fetch(`${process.env.REACT_APP_AAPI_URL}/ai/close/${ticker}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setClose(data);
    };
    const getMean = async () => {
        const response = await fetch(`${process.env.REACT_APP_AAPI_URL}/ai/mean/${ticker}`, {
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
        const response = await fetch(`${process.env.REACT_APP_AAPI_URL}/ai/momentum/${ticker}`, {
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
                        <ReactApexChart options={options} series={series} type="candlestick" height={350} />
                    </div>
                    <h4>Candlestick charts help investors keep track of price movements over time. Every candlestick consists of a rectangular body and two wicks on either end. Each candlestick represents one day’s worth of price data for a stock: the opening price, the closing price, the lowest price of the day and the highest price of the day. The color of the central rectangle is determined by if the price fell after open or rose. Green candlesticks are bullish and indicate buying pressure, while red candlesticks are bearish and indicate selling pressure. Our bots identify patterns in these candlesticks over time to estimate support and resistance levels, as well as the proper time to enter and exit trades. When the most popular bullish candlestick patterns are detected, the bots are prompted to buy shares of a stock. Likewise, when the most popular bearish patterns are identified, the bots are prompted to sell out of a position.   <b><a href="https://www.investopedia.com/articles/active-trading/062315/using-bullish-candlestick-patterns-buy-stocks.asp">Read More</a></b></h4>
                </div>
            </div>
        </div>
    );
}

export default AIPage;
