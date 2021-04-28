import { React, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useHistory } from 'react-router-dom';
// eslint-disable-next-line import/no-unresolved
import { Lightbulb } from 'react-bootstrap-icons';
import Container from 'react-bootstrap/Container';
import StockStatistics from './Sections/StockStatistics';
import StockGraph from './Sections/StockGraph';
import '../../styles/IndividualStock/IndividualStock.scss';

require('dotenv').config();

function IndividualStockPage() {
    /* eslint-disable max-len */
    const history = useHistory();
    const ticker = history.location.state.tickerSymbol;
    const [graph, setGraph] = useState('');
    const [currentPrice, setcurrPrice] = useState('');
    const [difference, setDifference] = useState('');
    const [percentChange, setPercentChange] = useState('');
    const [statistics, setStatistics] = useState({
        tickerSymbol: '',
        equityName: '',
        peRatio: '',
        avgVolume: '',
        beta: '',
        dividend: '',
        earningsDate: '',
        eps: '',
        openPrice: '',
        volume: '',
        week52High: '',
        week52Low: '',
        previousClose: '',
        marketCap: '',
    });
    function calculatePercentChange(data) {
        const first = data[Object.keys(data)[0]];
        const last = data[Object.keys(data)[Object.keys(data).length - 1]];
        setDifference((last - first).toFixed(2));
        setPercentChange((((last - first) / Math.abs(first)) * 100).toFixed(2));
    }
    const getHistoricalData = async (timeFrame) => {
        const response = await fetch(`${process.env.REACT_APP_SAPI_URL}/equity/historical/${ticker}?timeframe=${timeFrame}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setGraph(data);
        calculatePercentChange(data);
    };

    const getIntraday = async () => {
        const response = await fetch(`${process.env.REACT_APP_SAPI_URL}/equity/intraday/${ticker}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setGraph(data);
        calculatePercentChange(data);
    };

    const getCurrentPrice = async () => {
        const response = await fetch(`${process.env.REACT_APP_SAPI_URL}/equity/current/${ticker}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setcurrPrice(data.price.toFixed(2));
    };
    const getStatistics = async () => {
        const response = await fetch(`${process.env.REACT_APP_SAPI_URL}/equity/statistics/${ticker}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.dividend == null) {
            data.dividend = 0;
        }
        if (data.openPrice == null) {
            data.openPrice = 'N/A';
        }
        if (data.earningsDate == null) {
            data.earningsDate = 'N/AT';
        }
        setStatistics({
            tickerSymbol: data.tickerSymbol,
            equityName: data.equityName,
            peRatio: data.peRatio.toFixed(2),
            avgVolume: data.avgVolume,
            beta: data.beta.toFixed(2),
            dividend: data.dividend.toFixed(2),
            earningsDate: data.earningsDate.slice(0, data.earningsDate.lastIndexOf('T')),
            eps: data.eps,
            openPrice: data.openPrice,
            volume: data.volume,
            week52High: data.week52High,
            week52Low: data.week52Low,
            previousClose: data.previousClose,
            marketCap: data.marketCap,
        });
    };
    const ai = () => {
        history.push('/ai', { tickerSymbol: ticker });
    };
    useEffect(() => {
        getCurrentPrice();
        getIntraday();
        getStatistics();
    }, []);
    return (
        <Container className="stock-container">
            <div className="header">
                <div className="full-title">
                    <h1>{statistics.equityName} ({ticker.toUpperCase()})</h1>
                    <Button className="ai-button" onClick={ai} size="lg">
                        <Lightbulb />
                    </Button>
                </div>
                <div className="current-price">
                    <span><h2><b>${currentPrice}</b></h2></span>
                    &nbsp;&nbsp;&nbsp;
                    {difference > 0
                        ? <span><b><h5 style={{ color: difference > 0 ? 'green' : 'red' }}>+{difference}&nbsp;(+{percentChange}%)</h5></b></span>
                        : <span><b><h5 style={{ color: difference > 0 ? 'green' : 'red' }}>{difference}&nbsp;({percentChange}%)</h5></b></span> }
                </div>
            </div>
            <div className="stats-container">
                <div className="makeshift-tab-component">
                    <ButtonGroup>
                        <Button className="time-button" onClick={() => getIntraday()} variant="outline-primary">
                            1D
                        </Button>
                        <Button className="time-button" onClick={() => getHistoricalData('5d')} variant="outline-primary">
                            5D
                        </Button>
                        <Button className="time-button" onClick={() => getHistoricalData('1m')} variant="outline-primary">
                            1M
                        </Button>
                        <Button className="time-button" onClick={() => getHistoricalData('6m')} variant="outline-primary">
                            6M
                        </Button>
                        <Button className="time-button" onClick={() => getHistoricalData('ytd')} variant="outline-primary">
                            YTD
                        </Button>
                        <Button className="time-button" onClick={() => getHistoricalData('1y')} variant="outline-primary">
                            1Y
                        </Button>
                        <Button className="time-button" onClick={() => getHistoricalData('5y')} variant="outline-primary">
                            5Y
                        </Button>
                    </ButtonGroup>
                    <div className="graph">
                        <StockGraph graph={graph} color={difference > 0 ? 'rgba(98, 252, 3, 1)' : 'red'} />
                    </div>
                </div>
                <Container className="stats">
                    <StockStatistics statistics={statistics} />
                </Container>
            </div>
        </Container>
    );
}
export default IndividualStockPage;
