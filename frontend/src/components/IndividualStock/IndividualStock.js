import { React, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import StockStatistics from './Sections/StockStatistics';
import StockGraph from './Sections/StockGraph';
import '../../styles/IndividualStock/IndividualStock.scss';

require('dotenv').config();

function IndividualStockPage() {
    const history = useHistory();
    const ticker = history.location.state.tickerSymbol;
    const [graph, setGraph] = useState('');
    const [currentPrice, setcurrPrice] = useState('');
    const [timeframe, setTimeframe] = useState('');
    const [difference, setDifference] = useState('');
    const [percentChange, setPercentChange] = useState('');
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
    function calculatePercentChange(data) {
        const first = data[Object.keys(data)[0]];
        const last = data[Object.keys(data)[Object.keys(data).length - 1]];
        setDifference((last - first).toFixed(2));
        setPercentChange((((last - first) / Math.abs(first)) * 100).toFixed(2));
    }
    const getHistoricalData = async (timeFrame) => {
        setTimeframe(timeFrame);
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
    const getCurrentPrice = async () => {
        const response = await fetch(`${process.env.REACT_APP_SAPI_URL}/equity/current/${ticker}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setcurrPrice(data.price);
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
            data.dividend = 0;
        }
        if (data.openPrice == null) {
            data.openPrice = 'N/A';
        }
        if (data.earningsDate == null) {
            data.earningsDate = 'N/AT';
        }
        if (data.exDividend == null) {
            data.exDividend = 'N/AT';
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
    };
    useEffect(() => {
        getCurrentPrice();
        getHistoricalData('1m');
        getStatistics();
    }, []);
    return (
        <div className="stock-container">
            <div className="header">
                <h3>{ticker}</h3>
                <h1>{statistics.equityName}</h1>
                <div className="currentPrice">
                    <span><h2><b>${currentPrice}</b></h2></span>
                    &nbsp;&nbsp;&nbsp;
                    <span><b><h5 style={{ color: difference > 0 ? 'green' : 'red' }}>{difference}&nbsp;({percentChange}%)</h5></b></span>
                </div>
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
                    <h2>{timeframe}</h2>
                    <StockGraph graph={graph} />
                </div>
            </div>
            <div className="stats">
                <StockStatistics statistics={statistics} />
            </div>
        </div>
    );
}
export default IndividualStockPage;
