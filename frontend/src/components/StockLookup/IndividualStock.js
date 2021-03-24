import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../../styles/StockLookup/IndividualStock.scss';

function IndividualStockPage() {
    const [ticker, setTicker] = useState('');
    const [state, setState] = useState('');
    const [currentPrice, setcurrPrice] = useState('');
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
    const getData = () => {
        axios.get(`http://localhost:3000/equity/current/${ticker}`)
            .then((response) => {
                const { data } = response;
                setcurrPrice(data.price);
            })
            .catch((err) => console.error(err));
        axios.get(`http://localhost:3000/equity/statistics/${ticker}`)
            .then((response) => {
                const { data } = response;
                setStatistics({
                    tickerSymbol: data.tickerSymbol,
                    equityName: data.equityName,
                    peRatio: data.peRatio,
                    askPrice: data.askPrice,
                    avgVolume: data.avgVolume,
                    beta: data.beta,
                    dividend: data.dividend,
                    bidPrice: data.bidPrice,
                    dayHigh: data.dayHigh,
                    dayLow: data.dayLow,
                    earningsDate: data.earningsDate,
                    eps: data.eps,
                    exDividend: data.exDividend,
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
    };
    return (
        <div className="stock-container">
            <h4>Temporary form where you enter desired equity!</h4>
            <div className="ticker-form">
                <Form>
                    <Form.Group controlId="formTicker">
                        <Form.Label>Ticker Symbol:</Form.Label>
                        <Form.Control type="text" placeholder="Enter ticker" onChange={(e) => setTicker(e.target.value)} />
                    </Form.Group>
                    <Button onClick={getData}>
                        Submit
                    </Button>
                </Form>
            </div>
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
                        <div className="stats">
                            <h3>
                                <b>Previous Close:&nbsp;</b>
                                {statistics.previousClose}
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <b>Market Capitalization:&nbsp;</b>
                                {statistics.marketCap}
                            </h3>
                            <h3>
                                <b>Open:&nbsp;</b>
                                {statistics.openPrice}
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <b>BetaMarket Capitalization:&nbsp;</b>
                                {statistics.beta}
                            </h3>
                            <h3>
                                <b>Bid Price:&nbsp;</b>
                                {statistics.bidPrice}
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <b>PE Ratio:&nbsp;</b>
                                {statistics.peRatio}
                            </h3>
                            <h3>
                                <b>Ask:&nbsp;</b>
                                {statistics.askPrice}
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <b>EPS:&nbsp;</b>
                                {statistics.eps}
                            </h3>
                            <h3>
                                <b>Day Range:&nbsp;</b>
                                {statistics.dayLow}
                                -
                                {statistics.dayHigh}
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <b>Earning Date:&nbsp;</b>
                                {statistics.earningsDate}
                            </h3>
                            <h3>
                                <b>52 Week Range:&nbsp;</b>
                                {statistics.week52Low}
                                -
                                {statistics.week52High}
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <b>Dividend:&nbsp;</b>
                                {statistics.dividend}
                            </h3>
                            <h3>
                                <b>Volume:&nbsp;</b>
                                {statistics.volume}
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <b>Ex-Dividend Date:&nbsp;</b>
                                {statistics.exDividend}
                            </h3>
                            <h3>
                                <b>Average Volume:&nbsp;</b>
                                {statistics.avgVolume}
                            </h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default IndividualStockPage;
