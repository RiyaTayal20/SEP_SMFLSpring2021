import React from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import '../../../styles/Portfolio/Positions.scss';

const Positions = (props) => {
    const { portfolio } = props;
    /* eslint-disable max-len */

    return (
        <Container className="portfolio-positions-container" style={{ width: '1500px' }}>
            {portfolio && portfolio.holdings && (
                <div>
                    <div className="positions-header">
                        <h1>Positions</h1>
                    </div>
                    <Table striped bordered hover variant="light" className="positions-list">
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Current Price($)</th>
                                <th>Total Value($)</th>
                                <th>Average Cost Basis($)</th>
                                <th>Total Gain($)</th>
                                <th>Day Gain(%)</th>
                            </tr>
                        </thead>
                        {portfolio
                            && (
                                <tbody>
                                    {portfolio.holdings
                                    && Object.keys(portfolio.holdings).map((ticker) => (
                                        <tr key={ticker}>
                                            <td>{ticker.toUpperCase()}</td>
                                            <td>{portfolio.holdings[ticker].equityName}</td>
                                            <td>{portfolio.holdings[ticker].quantity}</td>
                                            <td>{portfolio.holdings[ticker].currentPrice}</td>
                                            <td>{portfolio.holdings[ticker].totalValue}</td>
                                            <td>{portfolio.holdings[ticker].costBasis}</td>
                                            <td>{portfolio.holdings[ticker].totalChange}</td>
                                            <td>{portfolio.holdings[ticker].closePercentChange}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            )}
                    </Table>
                </div>
            )}
        </Container>
    );
};

export default Positions;
