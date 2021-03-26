import React, { useState, useEffect } from 'react';
import '../../styles/Trade/Trade.scss';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { InputGroup } from 'react-bootstrap';
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

    const getLeagues = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${username}/league`, {
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

    const sendTrade = async () => fetch(`${process.env.REACT_APP_API_URL}/trade/submit`, {
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
        event.preventDefault();
        if (subform.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true);
        if (validated) {
            // Set time
            const expDate = new Date();
            if (form.duration === 'GDT') {
                expDate.setDate(expDate.getDate() + 50 * 365); // Add 50 years
            } else { // Day order
                if (expDate.getHours() >= 16) expDate.setDate(expDate.getDate() + 1); // If after 4pm, set to next day
                expDate.setHours(16, 0, 0, 0); // Set to 4pm
            }
            setExpiryDate(expDate);
            console.log(validated);
            console.log(expiryDate);
            sendTrade();
        }
    };

    useEffect(() => {
        getLeagues();
    }, []);

    return (
        <div className="trade-page">
            <Container>
                <Row>
                    <Col className="trade-form-container">
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
                                            <div>League:</div>
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
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                    <Form.Group controlId="formStockSymbol">
                                        <Row>
                                            <div>Ticker:</div>
                                            <Col>
                                                <InputGroup>
                                                    <Form.Control
                                                        type="text"
                                                        required
                                                        placeholder="Ex: GME"
                                                        onChange={(e) => setField('ticker', e.target.value)}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please input a ticker.
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                    <Form.Group controlId="formTransactionType">
                                        <Row>
                                            <div>Transaction:</div>
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
                                            <div>Quantity:</div>
                                            <Col>
                                                <InputGroup>
                                                    <Form.Control
                                                        type="number"
                                                        required
                                                        min="0"
                                                        placeholder="Ex: 3"
                                                        onChange={(e) => setField('quantity', e.target.value)}
                                                    />
                                                </InputGroup>
                                                <Form.Control.Feedback type="invalid">
                                                    Please input a quantity.
                                                </Form.Control.Feedback>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                    <Form.Group controlId="formOrderType">
                                        <Row>
                                            <div>Price:</div>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    required
                                                    defaultValue="Choose..."
                                                    onChange={(e) => {
                                                        setField('orderType', e.target.value);
                                                        if (e.target.value === 'Limit' || e.target.value === 'Stop') {
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
                                            <div>Duration:</div>
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
                                <Button type="submit">Submit</Button>
                            </Form>
                        </div>
                    </Col>

                    <Col className="account-details-container">
                        <div className="account-details-information">
                            <div className="account-details-title">
                                Account Details
                            </div>
                            <div className="value-section">
                                <div className="value-title">Value (USD):</div>
                                {/* {Value} */}
                            </div>

                            <div className="buying-power-section">
                                <div className="buying-power">Buying Power:</div>
                                {/* {Buying Power} */}
                            </div>
                            <div className="cash-section">
                                <div className="cash">Cash:</div>
                                {/* {Cash} */}
                            </div>
                            <div className="stock-square">
                                <small>
                                    <div className="displayStock">
                                        <div className="stock-sym-box">
                                            <div>Stock Name</div>
                                        </div>
                                        <div className="last-box-section">
                                            <div>Last</div>

                                        </div>
                                        <div className="change-box-section">
                                            <div>Change</div>

                                        </div>
                                        <div className="percent-change-section">
                                            <div>% Change</div>

                                        </div>
                                        <div className="volume-section">
                                            <div>Volume</div>

                                        </div>
                                        <div className="day-high-section">
                                            <div>Day&apos;s High</div>

                                        </div>
                                        <div className="day-low-section">
                                            <div>Day&apos;s Low</div>
                                        </div>
                                    </div>
                                </small>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Trade;
