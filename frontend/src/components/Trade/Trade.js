import React, { useState } from 'react';
import '../../styles/Trade/Trade.scss';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { InputGroup } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Trade() {
    /* eslint-disable max-len */
    /* eslint-disable no-unused-vars */
    // const order = () => { };
    const [league, setLeague] = useState(null);
    const [leagueList, setLeagueList] = useState();
    const [showPrice, setShowPrice] = useState(false);

    return (
        <Container className="trade-page">
            <div className="trade-form-information">
                <div className="order-title">
                    Order
                </div>
                <Form className="trade-form">
                    <div className="form-content">
                        <Form.Group controlId="formLeagueName">
                            <Row>
                                <Form.Label>League:</Form.Label>
                                <Col>
                                    <Form.Control as="select">
                                        <option>League options go here</option>
                                    </Form.Control>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group controlId="formStockSymbol">
                            <Row>
                                <Form.Label>Ticker:</Form.Label>
                                <Col>
                                    <InputGroup>
                                        <Form.Control type="text" placeholder="Ex: GME" />
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group controlId="formTransactionType">
                            <Row>
                                <Form.Label>Type:</Form.Label>
                                <Col>
                                    <Form.Control as="select">
                                        <option>Buy</option>
                                        <option>Sell</option>
                                    </Form.Control>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group controlId="formQuanitity">
                            <Row>
                                <Form.Label>Quantity:</Form.Label>
                                <Col>
                                    <InputGroup>
                                        <Form.Control type="text" placeholder="Ex: 3" />
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group controlId="formOrderType">
                            <Row>
                                <Form.Label>Price:</Form.Label>
                                <Col>
                                    <Form.Control
                                        as="select"
                                        defaultValue="Choose..."
                                        onChange={(e) => {
                                            if (e.target.value === 'Limit' || e.target.value === 'Stop') {
                                                setShowPrice(true);
                                            } else {
                                                setShowPrice(false);
                                            }
                                        }}
                                    >
                                        <option value="Market">Market</option>
                                        <option value="Limit">Limit</option>
                                        <option value="Stop">Stop</option>
                                    </Form.Control>
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
                                            />
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </Form.Group>
                        )}
                        <Form.Group controlId="formDuration">
                            <Row>
                                <Form.Label>Duration:</Form.Label>
                                <Col>
                                    <Form.Control
                                        as="select"
                                        defaultValue="Choose..."
                                    >
                                        <option>Good Till Canceled</option>
                                        <option>Day Order</option>
                                    </Form.Control>
                                </Col>
                            </Row>
                        </Form.Group>
                    </div>
                    <Button size="lg">Submit</Button>
                </Form>
            </div>
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
        </Container>
    );
}

export default Trade;
