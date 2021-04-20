import { React, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import '../../styles/Ai/Ai.scss';

function AIPage() {
    /* eslint-disable max-len */
    const history = useHistory();
    const ticker = history.location.state.tickerSymbol;
    const [close, setClose] = useState('');
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
                                        fillBetweenSet: 1,
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
                                        fillBetweenSet: 1,
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
                                            labelString: '$',
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
                    <h4>Every time that the current price of the stock breaks out above the upper bollinger band, the ai player will buy into this position. This is shown by the green triangles in the graph above. Every time the price falls below the lower bollinger band, the ai player employing this algorithm will sell a position in this stock. This is shown by the red triangles in the graph above.</h4>
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
                    <h4>Whenever the relative standard index (RSI) values are above 70, this indicates an overbought condition, meaning it is a good time to sell out of your position. The AI player sell all shares of a position as seen in the red triangles in the graph. Whenever the RSI is below 30, this indicates an oversold condition, meaning it is a good time to buy shares or increase position in a stock. The AI players will buy shares of this equity as seen through the green triangles in the graph. </h4>
                </div>
                <div className="candlesticks">
                    <h1><b>Japanese Candlesticks</b></h1>
                    <p>insert graph here</p>
                    <h4>description</h4>
                </div>
            </div>
        </div>
    );
}

export default AIPage;
