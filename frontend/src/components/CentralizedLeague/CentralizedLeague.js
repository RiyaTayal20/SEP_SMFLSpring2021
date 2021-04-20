import React from 'react';
// import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import '../../styles/CentralizedLeague/CentralizedLeague.scss';
// import { Dropdown } from 'react-bootstrap';
// import DropdownButton from 'react-bootstrap/DropdownButton';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
import { Line } from 'react-chartjs-2';

function CentralizedLeague() {
    const dates = '';
    const prices = '';
    return (
        <Container className="custom-cont">
            <div className="centra-league-page">
                <h1 className="league-header">League Name</h1>
                <Row className="lead-graph">
                    <h3 className="graph-header"> League Graph </h3>
                    <Line
                        className="Graph"
                        data={{
                            labels: dates, // all x values
                            datasets: [
                                {
                                    label: 'Portfolio Value',
                                    data: prices, // all y values
                                    borderColor: 'rgba(98, 252, 3, 1)',
                                    hoverBackgroundColor: 'blue',
                                    fill: false,
                                    borderWidth: 1,
                                    lineTension: 0.1,
                                    title: 'League Graph',
                                },
                            ],
                        }}
                        height={400}
                        width={800}
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
                </Row>

                <Row>
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
                    </Table>
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
                    </Table>
                </Row>

            </div>
        </Container>

    );
}

export default CentralizedLeague;
