import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
// import Form from 'react-bootstrap/Form';
// import Container from 'react-bootstrap/Container';
import '../../styles/CentralizedLeague/CentralizedLeague.scss';
// import { Dropdown } from 'react-bootstrap';
// import DropdownButton from 'react-bootstrap/DropdownButton';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Line } from 'react-chartjs-2';

function CentralizedLeague() {
    const location = useLocation();

    const [league, setLeague] = useState('');
    const [leagueData, setLeagueData] = useState(null);
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i += 1) {
        const currDate = new Date(new Date().setDate(today.getDate() - i)).toDateString();
        dates.push(currDate);
    }
    /* eslint-disable max-len, arrow-body-style */
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

    useEffect(async () => {
        if (league) {
            setLeagueData(await getLeagueData());
        }
    }, [league]);

    useEffect(() => {
        setLeague(location.state.league);
    }, []);

    return (
    // <Container className="custom-cont">
        <div className="centra-league-page">
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
                                        <td>{portfolio.currentNetWorth}</td>
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
                                    labels: dates, // all x values
                                    datasets: leagueData.portfolios.map((portfolio) => {
                                        return {
                                            label: portfolio.owner,
                                            data: portfolio.netWorth,
                                            borderColor: 'rgba(98, 252, 3, 1)',
                                            hoverBackgroundColor: 'blue',
                                            fill: false,
                                            borderWidth: 1,
                                            lineTension: 0.1,
                                        };
                                    }),
                                    // datasets: [
                                    //     {
                                    //         label: 'Portfolio Value',
                                    //         data: prices, // all y values
                                    //         borderColor: 'rgba(98, 252, 3, 1)',
                                    //         hoverBackgroundColor: 'blue',
                                    //         fill: false,
                                    //         borderWidth: 1,
                                    //         lineTension: 0.1,
                                    //         title: 'League Graph',
                                    //     },
                                    // ],
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
                                    <td>{transaction.tickerSymbol}</td>
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
    // </Container>

    );
}

export default CentralizedLeague;
