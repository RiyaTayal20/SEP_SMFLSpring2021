import React from 'react';
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
    const dates = '';
    const prices = '';
    return (
        <div className="centra-league-page">
            <Row>
                <Col>
                    <Table>
                        <thead>
                            <tr>
                                <th>Rank #</th>
                                <th>Investor</th>
                                <th>Account Value</th>
                                <th>Growth</th>
                            </tr>
                        </thead>
                    </Table>
                </Col>
                <Col>
                    <Line>
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
                                },
                            ],
                        }}
                        height={300}
                        width={500}
                        options={{
                            backgroundColor: 'white',
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
                              className ="Graph",         
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
                    </Line>
                </Col>
            </Row>
        </div>

    );
}

export default CentralizedLeague;
