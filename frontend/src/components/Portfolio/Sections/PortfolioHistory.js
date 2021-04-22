import React from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import '../../../styles/Portfolio/PortfolioHistory.scss';

const PortfolioHistory = (props) => {
    const { portfolio } = props;

    return (
        <Container className="portfolio-history-container">
            {portfolio && portfolio.orders
                && (
                    <div>
                        <div className="history-header">
                            <h1>Transaction History</h1>
                        </div>
                        <Table striped bordered hover variant="light" className="history-list">
                            <thead>
                                <tr>
                                    <th>Date Placed</th>
                                    <th>Ticker</th>
                                    <th>Quantity</th>
                                    <th>Price Per Share($)</th>
                                    <th>Total Price($)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolio.orders.filter((order) => order.executed).map((order) => (
                                    /* eslint-disable no-underscore-dangle, max-len */
                                    <tr key={order._id}>
                                        <td>{new Date(order.timePlaced).toString().split('GMT')[0]}</td>
                                        <td>{(order.tickerSymbol).toUpperCase()}</td>
                                        <td>{order.quantity}</td>
                                        <td>{parseFloat(order.pricePerShare).toFixed(2)}</td>
                                        <td>{parseFloat(order.totalPrice).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
        </Container>
    );
};

export default PortfolioHistory;
