import React from 'react';
import '../../styles/Trade/Trade.scss';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';

function Trade() {
    const order = () => { };
    return (
        <div className="trade-page">
            <div className="order-stock-component">
                <h2 className="order-title" style={{ fontSize: '2rem' }}>ORDER STOCK</h2>
                <div className="league-section">
                    <h3 className="league-title" style={{ fontSize: '1.25rem' }}>League:</h3>
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
                    <h3 className="stock-symbol-title" style={{ fontSize: '1.25rem' }}>Stock Symbol:</h3>
                    <Form.Group className="stock-symbol" controlId="stockSymbol" style={{ border: 'none' }}>
                        <Form.Control type="stock-symbol" placeholder="Enter Stock Symbol" style={{ border: 'none' }} />
                    </Form.Group>
                </div>

                <div className="transaction-section">
                    <h3 className="transaction-title" style={{ fontSize: '1.25rem' }}>Transaction:</h3>
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
                    <h3 className="quantity-title" style={{ fontSize: '1.25rem' }}>Quantity:</h3>
                    <Form>
                        <Form.Group className="quantity-box" controlId="quantity">
                            <Form.Control type="quantity" placeholder="Enter Quantity" style={{ border: 'none' }} />
                        </Form.Group>
                    </Form>
                </div>
                <div className="price-section">
                    <h3 className="price-title" style={{ fontSize: '1.25rem' }}>Price:</h3>
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
                                        <Form.Control type="limitStock" placeholder="Enter Limit Price" style={{ border: 'none' }} />
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
                                <Form.Control type="stopStock" placeholder="Enter Stop Price" style={{ border: 'none' }} />
                            </Form.Group>
                        </div>
                    </div>
                </div>
                <div className="duration-section">
                    <h3 className="duration-title" style={{ fontSize: '1.25rem' }}>Duration:</h3>
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
            <div className="account-details-information">
                <h2 className="account-details" style={{ fontSize: '2rem' }}>ACCOUNT DETAILS</h2>
                <div className="value-section">
                    <h3 className="value-title" style={{ fontSize: '1.25rem' }}>Value (USD):</h3>
                    <Form>
                        <input className="value-display" type="text" placeholder="Value" readOnly style={{ border: 'none' }} />
                    </Form>
                </div>
                <div className="buying-power-section">
                    <h3 className="buying-power" style={{ fontSize: '1.25rem' }}>Buying Power:</h3>
                    <Form>
                        <input className="buying-power-display" type="text" placeholder="Buying Power" readOnly style={{ border: 'none' }} />
                    </Form>
                </div>
                <div className="cash-section">
                    <h3 className="cash" style={{ fontSize: '1.25rem' }}>Cash: </h3>
                    <Form>
                        <input className="cash-display" type="text" placeholder="Cash" readOnly style={{ border: 'none' }} />
                    </Form>
                </div>
                <div className="stock-square">
                    <small>
                        <div className="displayStock">
                            <div className="stock-sym-box">
                                <Form>
                                    <input className="stock-name-symbol" type="text" placeholder="SYMBOL" readOnly style={{ border: 'none' }} />
                                </Form>
                                <h3 className="stock-text" style={{ color: 'black' }}>Stock Name</h3>
                            </div>
                            <div className="last-box-section">
                                <h3 style={{ color: 'black' }}>Last</h3>
                                <Form>
                                    <input className="last-price-display" type="text" placeholder="Last" readOnly style={{ border: 'none' }} />
                                </Form>
                            </div>
                            <div className="change-box-section">
                                <h3 style={{ color: 'black' }}>Change</h3>
                                <Form>
                                    <input className="change-price-display" type="text" placeholder="Change" readOnly style={{ border: 'none' }} />
                                </Form>
                            </div>
                            <div className="percent-change-section">
                                <h3 style={{ color: 'black' }}>% Change</h3>
                                <Form>
                                    <input className="percent-change-display" type="text" placeholder="% Change" readOnly style={{ border: 'none' }} />
                                </Form>
                            </div>
                            <div className="volume-section">
                                <h3 style={{ color: 'black' }}>Volume</h3>
                                <Form>
                                    <input className="volume-display" type="text" placeholder="Volume" readOnly style={{ border: 'none' }} />
                                </Form>
                            </div>
                            <div className="day-high-section">
                                <h3 style={{ color: 'black' }}>Day&apos;s High</h3>
                                <Form>
                                    <input className="day-high-display" type="text" placeholder="High" readOnly style={{ border: 'none' }} />
                                </Form>
                            </div>
                            <div className="day-low-section">
                                <h3 style={{ color: 'black' }}>Day&apos;s Low</h3>
                                <Form>
                                    <input className="day-low-display" type="text" placeholder="Day's Low" readOnly style={{ border: 'none' }} />
                                </Form>
                            </div>
                        </div>
                    </small>
                </div>
            </div>
        </div>
    );
}

export default Trade;
