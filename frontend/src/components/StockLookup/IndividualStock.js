import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import {
    Row, Col, Tab, Tabs,
} from 'react-bootstrap';
import '../../styles/StockLookup/IndividualStock.scss';
/* FIX NULL VALUES (dayLow, dayHigh, open, bid) */

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
                        <div className="graph">
                            <Tabs defaultActiveKey="profile">
                                <Tab eventKey="1d" title="1D">
                                    <p>1 Day</p>
                                    <p>Graph goes here!</p>
                                </Tab>
                                <Tab eventKey="5d" title="5D">
                                    <p>5 Days</p>
                                </Tab>
                                <Tab eventKey="1m" title="1M">
                                    <p>1 Month</p>
                                </Tab>
                                <Tab eventKey="6m" title="6M">
                                    <p>6 Months</p>
                                </Tab>
                                <Tab eventKey="ytd" title="YTD">
                                    <p>Year To Date</p>
                                </Tab>
                                <Tab eventKey="1y" title="1Y">
                                    <p>1 Year</p>
                                </Tab>
                                <Tab eventKey="5y" title="5Y">
                                    <p>5 Year</p>
                                </Tab>
                            </Tabs>
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
                                        {statistics.bid}
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
