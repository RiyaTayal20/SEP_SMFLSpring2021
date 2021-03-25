import { React } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import '../../../styles/Portfolio/Positions.scss';

const Positions = (props) => {
    const { portfolio } = props;

    return (
        <div>
            <Container className="portfolio-positions-container">
                {portfolio && <h1>{portfolio.cashAvailable}</h1>}
                <Table striped bordered hover variant="dark" className="positions-list">
                    <thead>
                        <th>Symbol</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Current Price</th>
                        <th>Total Value</th>
                        <th>Average Cost Basis</th>
                        <th>Total Change</th>
                    </thead>
                    {portfolio
                        && (
                            <tbody>
                                {portfolio.holdings
                                && Object.keys(portfolio.holdings).map((ticker) => (
                                    <tr>
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
        </div>
    );
};

export default Positions;
