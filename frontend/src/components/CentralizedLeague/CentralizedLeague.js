import React, { useState, useEffect } from 'react';
import { useLocation, Link, useHistory } from 'react-router-dom';
import '../../styles/CentralizedLeague/CentralizedLeague.scss';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Line } from 'react-chartjs-2';

function CentralizedLeague() {
    const history = useHistory();
    const location = useLocation();

    const [league, setLeague] = useState('');
    const [leagueData, setLeagueData] = useState(null);
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i += 1) {
        const currDate = new Date(new Date().setDate(today.getDate() - i)).toDateString();
        dates.push(currDate);
    }
    /* eslint-disable max-len */
    /* eslint-disable arrow-body-style, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */

    const getLeagueData = async () => {
        const response = await fetch(`${process.env.REACT_APP_LAPI_URL}/league/overview/${league}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    };

    const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

    const lookupTicker = (ticker) => {
        history.push('/stock', { tickerSymbol: ticker });
    };

    useEffect(async () => {
        if (league) {
            setLeagueData(await getLeagueData());
        }
    }, [league]);

    useEffect(() => {
        setLeague(location.state.league);
    }, []);

    return (
        <div className="central-league-page">
            <h1 className="league-header">{league}</h1>
            <Row className="lead-graph">
                <Col sm={6}>
                    <h3>Leaderboard</h3>
                    <Table className="leaderboard-table" striped bordered variant="light">
                        <thead>
                            <tr>
                                <th>Rank #</th>
                                <th>Investor</th>
                                <th>Account Value</th>
                                <th>Growth</th>
                            </tr>
                        </thead>
                        {leagueData && leagueData.portfolios && (
                            <tbody>
                                {leagueData.portfolios.map((portfolio) => (
                                    <tr key={portfolio.owner}>
                                        <td>{portfolio.position}</td>
                                        <Link to={{
                                            pathname: '/portfolio',
                                            selectedUser: {
                                                league,
                                                username: portfolio.owner,
                                            },
                                        }}
                                        >
                                            <td>{portfolio.owner}</td>
                                        </Link>
                                        <td>{portfolio.currentNetWorth.toFixed(2)}</td>
                                        <td>{`${portfolio.growth}%`}</td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </Table>
                </Col>
                <Col>
                    <h3 className="graph-header"> League Graph </h3>
                    <div>
                        {leagueData && leagueData.portfolios && (
                            <Line
                                className="Graph"
                                data={{
                                    labels: dates.reverse(), // all x values
                                    datasets: leagueData.portfolios.map((portfolio) => {
                                        return {
                                            label: portfolio.owner,
                                            data: portfolio.netWorth.slice(4, 35).map((day) => day.worth.toFixed(2)),
                                            borderColor: `rgb(${randomBetween(0, 255)}, ${randomBetween(0, 255)}, ${randomBetween(0, 255)})`,
                                            hoverBackgroundColor: 'blue',
                                            fill: false,
                                            borderWidth: 1,
                                            lineTension: 0.1,
                                        };
                                    }),
                                }}
                                height={400}
                                width={500}
                                options={{
                                    maintainAspectRatio: false,
                                    tooltips: {
                                        backgroundColor: 'blue',
                                    },
                                    scales: {
                                        yAxes: [{
                                            gridLines: {
                                                color: 'gray',
                                                zeroLineColor: 'white',
                                            },
                                            scaleLabel: {
                                                display: true,
                                                fontSize: 15,
                                                fontColor: 'white',
                                                fontStyle: 'bold',
                                                labelString: 'Value',
                                            },
                                            ticks: {
                                                fontColor: 'white',
                                            },
                                        }],
                                        xAxes: [{
                                            gridLines: {
                                                color: 'gray',
                                                zeroLineColor: 'white',
                                            },
                                            scaleLabel: {
                                                display: true,
                                                fontSize: 15,
                                                fontColor: 'white',
                                                fontStyle: 'bold',
                                                labelString: 'Date',
                                            },
                                            ticks: {
                                                fontColor: 'white',
                                            },
                                        }],
                                    },
                                    legend: {
                                        labels: {
                                            fontSize: 12,
                                            fontColor: 'white',
                                        },
                                    },
                                }}
                            />
                        )}
                    </div>
                </Col>
            </Row>

            <Row>
                <h3>Transaction History</h3>
                <Table className="transaction-table" striped bordered variant="light">
                    <thead>
                        <tr>
                            <th>Stock Symbol</th>
                            <th>Buy/Sell</th>
                            <th>Quantity</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    {leagueData && leagueData.transactions && (
                        <tbody>
                            {leagueData.transactions.map((transaction) => (
                                <tr>
                                    <td onClick={() => lookupTicker(transaction.tickerSymbol)}>{transaction.tickerSymbol.toUpperCase()}</td>
                                    <td>{transaction.orderType.slice(-3) === 'Buy' ? 'Buy' : 'Sell'}</td>
                                    <td>{transaction.quantity}</td>
                                    <td>{`${new Date(transaction.timePlaced)}`}</td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </Table>
            </Row>
        </div>

    );
}

export default CentralizedLeague;
