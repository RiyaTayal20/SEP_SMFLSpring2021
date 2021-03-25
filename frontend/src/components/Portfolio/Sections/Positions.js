import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import '../../../styles/Portfolio/Positions.scss';

const Positions = (props) => {
    // const { username } = props;

    const [league, setLeague] = useState();
    const [portfolio, setPortfolio] = useState();

    const getPortfolio = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/league/portfolio`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                leagueName: league,
            }),
        });
        setPortfolio(await response.json());
    };

    useEffect(() => {
        console.log(props);
        setLeague('Test League 4');
        getPortfolio();
    });

    return (
        <div>
            <Container className="portfolio-positions-container">
                {portfolio && <h1>{portfolio.cashAvailable}</h1>}
                <Table striped bordered className="positions-list">
                    <thead>
                        <th>Symbol</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Current Price</th>
                        <th>Total Value</th>
                        <th>Average Cost Basis</th>
                        <th>Total Change</th>
                    </thead>
                </Table>
            </Container>
        </div>
    );
};

export default Positions;
