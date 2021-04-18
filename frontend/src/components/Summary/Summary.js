import React from 'react';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
import '../../styles/Summary/Summary.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import { useHistory } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';
// import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Line } from 'react-chartjs-2';

function Summary() {
    // const PortfolioGraph = (props) => {
    // const { portfolio } = props;
    const dates = '';
    const prices = '';
    // if (portfolio && portfolio.netWorth) {
    //     dates = Object.keys(portfolio.netWorth).map((i) =>
    // portfolio.netWorth[i].date.slice(0, portfolio.netWorth[i].date.lastIndexOf('T')));
    //     prices = Object.keys(portfolio.netWorth).map((j) => portfolio.netWorth[j].worth);
    // }
    // const username = sessionStorage.getItem('username');
    // const [league, setLeague] = useState(null);
    // const [leagueList, setLeagueList] = useState();

    // const getLeagues = async () => {
    // const response = await fetch(`${process.env.REACT_APP_LAPI_URL}/user/${username}/league`, {
    //         method: 'GET',
    //         headers: {
    //             Authorization: `Bearer ${localStorage.getItem('token')}`,
    //             'Content-Type': 'application/json',
    //         },
    //     });
    //     const data = await response.json()
    //         .then((result) => setLeagueList(result));
    //     return data;
    // };

    // useEffect(() => {
    //     getLeagues();
    // }, [league]);

    return (
        <div className="summary-page">
            <div className="league-dropdown-section">
                <Row>
                    <Col>
                        <DropdownButton title="Choose League" className="league-dropdown" size="lg">
                            <Dropdown.Item>
                                League
                            </Dropdown.Item>
                        </DropdownButton>
                    </Col>
                    <Col>
                        <DropdownButton title="Select Week" className="week-dropdown" size="lg">
                            <Dropdown.Item>
                                Date
                            </Dropdown.Item>
                        </DropdownButton>
                    </Col>
                </Row>
            </div>
            <div className="display-summary-info">
                <Row>
                    <Col>
                        <Card className="summ-display" style={{ width: '25rem' }}>
                            <ListGroup variant="flush">
                                <ListGroup.Item className="card-list">
                                    Based on the league&apos;s performance this week,
                                    you are ABOVE AVERAGE
                                </ListGroup.Item>
                                <ListGroup.Item className="card-list">u did better than toby congrats</ListGroup.Item>
                                <ListGroup.Item className="card-list">3rd place woo</ListGroup.Item>
                                <ListGroup.Item className="card-list">you sold this market order thing</ListGroup.Item>
                                <ListGroup.Item className="card-list">Tobi is the best, you lost</ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                    <Col>
                        <Line
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
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Summary;
