import React from 'react';
import '../../styles/Trade/Trade.scss';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';

function Trade() {
    const order = () => { };
    return (
        <div className="trade-page">
            <div className="order-stock-titles">
                <h2 className="order-title">ORDER STOCK</h2>

                <div className="league-section">
                    <h3 className="league-title">League:</h3>
                    <Dropdown className="league-dropdown">
                        <Dropdown.Toggle variant="success" id="dropdown-basic" background-color="#EEEEEE">
                            League Name
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">League #1</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">League #2</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">League #3</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <div className="stock-symbol-section">
                    <h3 className="stock-symbol-title">Stock Symbol:</h3>
                    <Form.Group className="stock-symbol" controlId="stockSymbol">
                        <Form.Control type="stock-symbol" placeholder="Enter Stock Symbol" />
                    </Form.Group>
                </div>

                <div className="transaction-section">
                    <h3 className="transaction-title">Transaction:</h3>
                    <Dropdown className="transaction-dropdown">
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Transaction Type
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Buy</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Sell</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <div className="quantity-section">
                    <h3 className="quantity-title">Quantity:</h3>
                    <Form>
                        <Form.Group controlId="quantity">
                            <Form.Control type="quantity" placeholder="Enter Quantity" />
                        </Form.Group>
                    </Form>
                </div>

                <div className="price-section">
                    <h3 className="price-title">Price:</h3>
                </div>
            </div>
            <div className="order-stock-boxes">
                <div className="radioBoxes">
                    <div className="market-section">
                        {['radio'].map((type) => (
                            <div key={`market-${type}`} className="market-radio">
                                <Form.Check
                                    type={type}
                                    id={`Market-${type}`}
                                    label="Market"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="limit-section">
                        {['radio'].map((type) => (
                            <div key={`limit-${type}`} className="limit-radio">
                                <Form.Check
                                    type={type}
                                    id={`Limit-${type}`}
                                    label="Limit $"
                                />
                                <Form.Group controlId="limitStock">
                                    <Form.Control type="limitStock" placeholder="Enter Limit Price" />
                                </Form.Group>
                            </div>
                        ))}
                    </div>
                    <div className="stop-section">
                        {['radio'].map((type) => (
                            <div key={`stop-${type}`} className="stop-radio">
                                <Form.Check
                                    type={type}
                                    id={`stop-${type}`}
                                    label="Stop $"
                                />
                            </div>
                        ))}
                        <Form.Group controlId="stopStock">
                            <Form.Control type="stopStock" placeholder="Enter Stop Price" />
                        </Form.Group>
                    </div>

                </div>
                <div className="Duration-section">
                    <h3 className="duration-title">Duration:</h3>
                    <Dropdown className="duration-dropdown">
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Duration
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Good Till Cancelled</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Day Order</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <Button className="previewOrder" variant="primary" onClick={order}>
                    Preview Order
                </Button>
            </div>
            <div className="account-details-titles">
                <h2 className="account-details">Account Details:</h2>
                <h3 className="value-title">Value(USD):</h3>
                <h3 className="buying-power">Buying Power:</h3>
                <h3 className="cash">Cash: </h3>
            </div>
        </div>
    );
}

export default Trade;