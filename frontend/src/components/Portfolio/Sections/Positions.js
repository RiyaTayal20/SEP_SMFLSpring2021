import { React } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import '../../../styles/Portfolio/Positions.scss';

const Positions = (props) => {
    const { portfolio } = props;
    console.log(portfolio);
    /* eslint-disable max-len */

    return (
        <Container className="portfolio-positions-container" style={{ width: '1500px' }}>
            {portfolio && portfolio.currentNetWorth
                && (
                    <div className="portfolio-header">
                        <h1>Portfolio value:</h1>
                        <h2>{portfolio.currentNetWorth}({portfolio.currentNetWorth / 500 > 1 ? `+${parseFloat((portfolio.currentNetWorth / 500 - 1) * 100).toFixed(2)}%` : `-${parseFloat((1 - portfolio.currentNetWorth / 500) * 100).toFixed(2)}%` })</h2>
                    </div>
                )}
            <Table striped bordered hover variant="light" className="positions-list">
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Current Price</th>
                        <th>Total Value</th>
                        <th>Average Cost Basis</th>
                        <th>Total Change</th>
                    </tr>
                </thead>
                {portfolio
                    && (
                        <tbody>
                            {portfolio.holdings
                            && Object.keys(portfolio.holdings).map((ticker) => (
                                <tr key={ticker}>
                                    <td>{ticker}</td>
                                    <td>{portfolio.holdings[ticker].equityName}</td>
                                    <td>{portfolio.holdings[ticker].quantity}</td>
                                    <td>{portfolio.holdings[ticker].currentPrice}</td>
                                    <td>{portfolio.holdings[ticker].totalValue}</td>
                                    <td>{portfolio.holdings[ticker].costBasis}</td>
                                    <td>{portfolio.holdings[ticker].totalChange}</td>
                                </tr>
                            ))}
                        </tbody>
                    )}
            </Table>
        </Container>
    );
};

export default Positions;
