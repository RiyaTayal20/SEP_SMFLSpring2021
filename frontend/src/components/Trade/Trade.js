import React, { useState, useEffect } from 'react';
import '../../styles/Trade/Trade.scss';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { InputGroup } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

function Trade() {
    /* eslint-disable max-len */
    /* eslint-disable no-unused-vars */
    const username = sessionStorage.getItem('username');

    const [league, setLeague] = useState(null);
    const [leagueList, setLeagueList] = useState();
    const [showPrice, setShowPrice] = useState(false);
    const [form, setForm] = useState({});
    const [validated, setValidated] = useState(false);
    const [expiryDate, setExpiryDate] = useState();
    const [showError, setShowError] = useState(false);
    const [showSucc, setShowSucc] = useState(false);
    const [errors, setErrors] = useState([]);
    const [portfolio, setPortfolio] = useState();
    const [equity, setEquity] = useState();
    const [submitText, setSubmitText] = useState('Confirm');

    const getLeagues = async () => {
        const response = await fetch(`${process.env.REACT_APP_LAPI_URL}/user/${username}/league`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json()
            .then((result) => setLeagueList(result));
        return data;
    };

    const getPortfolio = async () => {
        const response = await fetch(`${process.env.REACT_APP_LAPI_URL}/league/portfolio/${form.leagueName}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        setPortfolio(await response.json());
    };

    const getEquity = async () => {
        const response = await fetch(`${process.env.REACT_APP_SAPI_URL}/equity/statistics/${form.ticker}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        setEquity(await response.json());
    };

    const sendTrade = async () => fetch(`${process.env.REACT_APP_LAPI_URL}/trade/submit`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            leagueName: form.leagueName,
            orderType: form.orderType.concat(form.transactionType),
            tickerSymbol: form.ticker,
            quantity: form.quantity,
            expiryDate,
            pricePerShare: form.price,
        }),
    }).then((res) => {
        if (res.ok) {
            console.log('Successfully sent trade order');
            setShowSucc(true);
            setShowError(false);
        } else {
            setShowSucc(false);
            setShowError(true);
            res.json().then((data) => {
                console.log(data.errors);
                setErrors(data.errors);
                return null;
            });
        }
        return res.json().then((data) => data);
    }).catch((err) => {
        console.log(err);
        return null;
    });

    const setField = (field, val) => {
        setForm({
            ...form,
            [field]: val,
        });
    };

    const handleSubmit = (event) => {
        const subform = event.currentTarget;
        console.log(form.pricePerShare);
        event.preventDefault();
        if (subform.checkValidity() === false) {
            setValidated(false);
            event.stopPropagation();
        } else {
            setValidated(true);
            setSubmitText('Submit');
            // Set time
            const expDate = new Date();
            if (form.duration === 'GDT') {
                expDate.setDate(expDate.getDate() + 50 * 365); // Add 50 years
            } else { // Day order
                if (expDate.getHours() >= 16) expDate.setDate(expDate.getDate() + 1); // If after 4pm, set to next day
                expDate.setHours(16, 0, 0, 0); // Set to 4pm
            }
            setExpiryDate(expDate);
            sendTrade();
        }
    };

    useEffect(() => {
        getLeagues();
    }, []);

    useEffect(() => {
        if (form.leagueName !== '') getPortfolio();
    }, [form.leagueName]);

    useEffect(() => {
        console.log('Validated changed');
        if (validated) {
            getEquity();
            console.log('Getting equity!');
        }
    }, [validated]);

    return (
        <Container className="trade-page">
            <div className="trade-form-information">
                <div className="order-title">
                    Order
                </div>
                {showSucc
                && (
                    <Alert variant="success" onClose={() => setShowSucc(false)} dismissible>
                        Your order was placed!
                    </Alert>
                )}
                {showError
                    && (
                        <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                            <Alert.Heading>Alert</Alert.Heading>
                            <ol>{errors.map((error) => <li>{error.msg}</li>)}</ol>
                        </Alert>
                    )}
                <Form className="trade-form" noValidate validated={validated} onSubmit={handleSubmit}>
                    <div className="form-content">
                        <Form.Group controlId="formLeagueName">
                            <Row>
                                <Form.Label className="label">League:</Form.Label>
                                <Col>
                                    <Form.Control
                                        as="select"
                                        required
                                        onChange={(e) => setField('leagueName', e.target.value)}
                                    >
                                        <option value="" hidden>Choose a League</option>
                                        {leagueList && leagueList.map((userLeague) => (
                                            <option value={userLeague.leagueName} key={userLeague.leagueName}>{userLeague.leagueName}</option>
                                        ))}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        Please choose a league.
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group controlId="formStockSymbol">
                            <Row>
                                <Form.Label className="label">Ticker:</Form.Label>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        required
                                        placeholder="Ex: GME"
                                        onChange={(e) => setField('ticker', e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please input a ticker.
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group controlId="formTransactionType">
                            <Row>
                                <Form.Label className="label">Type:</Form.Label>
                                <Col>
                                    <Form.Control
                                        as="select"
                                        required
                                        onChange={(e) => setField('transactionType', e.target.value)}
                                    >
                                        <option value="" hidden>Choose a Transaction Type</option>
                                        <option value="Buy">Buy</option>
                                        <option value="Sell">Sell</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        Please choose a transaction type.
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group controlId="formQuanitity">
                            <Row>
                                <Form.Label className="label">Quantity:</Form.Label>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        required
                                        min="0"
                                        placeholder="Ex: 3"
                                        onChange={(e) => setField('quantity', e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please input a quantity.
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group controlId="formOrderType">
                            <Row>
                                <Form.Label className="label">Price:</Form.Label>
                                <Col>
                                    <Form.Control
                                        as="select"
                                        required
                                        defaultValue="Choose..."
                                        onChange={(e) => {
                                            setField('orderType', e.target.value);
                                            if (e.target.value === 'limit' || e.target.value === 'stop') {
                                                setShowPrice(true);
                                            } else {
                                                setShowPrice(false);
                                            }
                                        }}
                                    >
                                        <option value="" hidden>Set a price</option>
                                        <option value="market">Market</option>
                                        <option value="limit">Limit</option>
                                        <option value="stop">Stop</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        Please choose an order type.
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>
                        </Form.Group>
                        {showPrice
                        && (
                            <Form.Group controlId="formPrice">
                                <Row>
                                    <Col>
                                        <InputGroup>
                                            <InputGroup.Prepend>
                                                <InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="Enter price"
                                                onChange={(e) => setField('price', e.target.value)}
                                            />
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </Form.Group>
                        )}
                        <Form.Group controlId="formDuration">
                            <Row>
                                <Form.Label className="label">Duration:</Form.Label>
                                <Col>
                                    <Form.Control
                                        as="select"
                                        required
                                        defaultValue="Choose..."
                                        onChange={(e) => setField('duration', e.target.value)}
                                    >
                                        <option value="" hidden>Set duration</option>
                                        <option value="GTC">Good Till Canceled</option>
                                        <option value="DO">Day Order</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        Please select a duration.
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>
                        </Form.Group>
                    </div>
                    <div className="trade-button-div">
                        <Button type="submit" size="lg">Submit</Button>
                    </div>
                </Form>
            </div>
            <div className="account-details-information">
                <div className="account-details-title">
                    Account Details
                </div>
                <div className="value-section">
                    <div className="value-title">Value (USD):</div>
                    {portfolio
                    && (
                        <div>{portfolio.currentNetWorth}</div>
                    )}
                </div>
                <div className="cash-section">
                    <div className="cash">Cash:</div>
                    {portfolio
                    && (
                        <div>{portfolio.cashAvailable}</div>
                    )}
                </div>
            </div>
        </Container>
    );
}

export default Trade;
