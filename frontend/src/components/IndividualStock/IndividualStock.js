import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import {
    Row, Col, // Tab, Tabs,
} from 'react-bootstrap';
import '../../styles/IndividualStock/IndividualStock.scss';
import { useHistory } from 'react-router-dom';

function IndividualStockPage() {
    const history = useHistory();
    const ticker = history.location.state.tickerSymbol;
    const [state, setState] = useState('');
    const [currentPrice, setcurrPrice] = useState('');
    const [date, setDate] = useState('');
    const [days, setDays] = useState([]);
    const [prices, setPrices] = useState([]);
    const [statistics, setStatistics] = useState({
        tickerSymbol: '',
        equityName: '',
        peRatio: '',
        askPrice: '',
        avgVolume: '',
        beta: '',
        dividend: '',
        bidPrice: '',
        dayHigh: '',
        dayLow: '',
        earningsDate: '',
        eps: '',
        exDividend: '',
        openPrice: '',
        volume: '',
        week52High: '',
        week52Low: '',
        previousClose: '',
        marketCap: '',
    });
    function getHistoricalData(input) {
        setDate(input);
        setDays([]);
        setPrices([]);
        axios.get(`${process.env.REACT_APP_API_URL}/${ticker}?timeframe=${input}`)
            .then((response) => {
                const { data } = response;
                for (let i = 0; i < Object.keys(data).length; i += 1) {
                    /* eslint-disable */ 
                    setDays((days) => [...days, i]);
                    setPrices((prices) => [...prices, data[Object.keys(data)[i]]]);
                    /* eslint-enable */
                }
            })
            .catch((err) => console.error(err));
    }
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/equity/current/${ticker}`)
            .then((response) => {
                const { data } = response;
                setcurrPrice(data.price);
            })
            .catch((err) => console.error(err));
        axios.get(`${process.env.REACT_APP_API_URL}/equity/statistics/${ticker}`)
            .then((response) => {
                const { data } = response;
                if (data.bidPrice == null || data.bidPrice === 0) {
                    data.bidPrice = 'N/A';
                }
                if (data.askPrice == null || data.askPrice === 0) {
                    data.askPrice = 'N/A';
                }
                if (data.dayLow == null) {
                    data.dayLow = 'N/A';
                }
                if (data.dayHigh == null) {
                    data.dayHigh = 'N/A';
                }
                if (data.dividend == null || data.dividend === 0) {
                    data.exDividend = 'N/A';
                    data.dividend = 'N/A';
                }
                setStatistics({
                    tickerSymbol: data.tickerSymbol,
                    equityName: data.equityName,
                    peRatio: data.peRatio.toFixed(3),
                    askPrice: data.askPrice,
                    avgVolume: data.avgVolume,
                    beta: data.beta.toFixed(3),
                    dividend: data.dividend.toFixed(3),
                    bidPrice: data.bidPrice,
                    dayHigh: data.dayHigh,
                    dayLow: data.dayLow,
                    earningsDate: data.earningsDate.slice(0, data.earningsDate.lastIndexOf('T')),
                    eps: data.eps,
                    exDividend: data.exDividend.slice(0, data.exDividend.lastIndexOf('T')),
                    openPrice: data.openPrice,
                    volume: data.volume,
                    week52High: data.week52High,
                    week52Low: data.week52Low,
                    previousClose: data.previousClose,
                    marketCap: data.marketCap,
                });
            })
            .catch((err) => console.error(err));
        setState('display');
    }, []);
    return (
        <div className="stock-container">
            <div className="stockInfo">
                {state === 'display' && (
                    <div>
                        <div className="currentPrice">
                            <h3>
                                {ticker}
                            </h3>
                            <h1>
                                {statistics.equityName}
                            </h1>
                            <h2>
                                <b>
                                    $
                                    {currentPrice}
                                </b>
                            </h2>
                        </div>
                        <div className="makeshift-tab-component">
                            <div className="graph-btns">
                                <Button className="button" onClick={() => getHistoricalData('5d')} variant="outline-primary">
                                    5D
                                </Button>
                                <Button className="button" onClick={() => getHistoricalData('1m')} variant="outline-primary">
                                    1M
                                </Button>
                                <Button className="button" onClick={() => getHistoricalData('6m')} variant="outline-primary">
                                    6M
                                </Button>
                                <Button className="button" onClick={() => getHistoricalData('ytd')} variant="outline-primary">
                                    YTD
                                </Button>
                                <Button className="button" onClick={() => getHistoricalData('1y')} variant="outline-primary">
                                    1Y
                                </Button>
                                <Button className="button" onClick={() => getHistoricalData('5y')} variant="outline-primary">
                                    5Y
                                </Button>
                            </div>
                            <div className="graph">
                                <h2>{date}</h2>
                                <Line
                                    data={{
                                        labels: days,
                                        datasets: [
                                            {
                                                label: 'Price',
                                                data: prices,
                                                borderColor: 'rgba(98, 252, 3, 1)',
                                                hoverBackgroundColor: 'blue',
                                                fill: false,
                                                borderWidth: 1,
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
                                                    fontSize: 15,
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
                                                    fontSize: 15,
                                                    fontColor: 'white',
                                                    fontStyle: 'bold',
                                                    labelString: 'Days',
                                                },
                                                ticks: {
                                                    fontColor: 'white',
                                                },
                                            }],
                                        },
                                        legend: {
                                            labels: {
                                                fontSize: 12,
                                                fontColor: 'white',
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                        <div className="stats">
                            <Container fluid="md">
                                <Row>
                                    <Col>
                                        <b>Previous Close:&nbsp;</b>
                                        {statistics.previousClose}
                                    </Col>
                                    <Col>
                                        <b>Market Cap:&nbsp;</b>
                                        {statistics.marketCap}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <b>Open:&nbsp;</b>
                                        {statistics.openPrice}
                                    </Col>
                                    <Col>
                                        <b>Beta:&nbsp;</b>
                                        {statistics.beta}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <b>Bid:&nbsp;</b>
                                        {statistics.bidPrice}
                                    </Col>
                                    <Col>
                                        <b>PE Ratio:&nbsp;</b>
                                        {statistics.peRatio}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <b>Ask:&nbsp;</b>
                                        {statistics.askPrice}
                                    </Col>
                                    <Col>
                                        <b>EPS:&nbsp;</b>
                                        {statistics.eps}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <b>Day Range:&nbsp;</b>
                                        {statistics.dayLow}
                                        -
                                        {statistics.dayHigh}
                                    </Col>
                                    <Col>
                                        <b>Earnings Date:&nbsp;</b>
                                        {statistics.earningsDate}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <b>52 Week Range:&nbsp;</b>
                                        {statistics.week52Low}
                                        -
                                        {statistics.week52High}
                                    </Col>
                                    <Col>
                                        <b>Dividend:&nbsp;</b>
                                        {statistics.dividend}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <b>Volume:&nbsp;</b>
                                        {statistics.volume}
                                    </Col>
                                    <Col>
                                        <b>Ex Dividend Date:&nbsp;</b>
                                        {statistics.exDividend}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <b>Average Volume:&nbsp;</b>
                                        {statistics.avgVolume}
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default IndividualStockPage;
