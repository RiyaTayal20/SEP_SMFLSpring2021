import React, { useEffect, useState } from 'react';
import '../../styles/JoinLeague/JoinLeague.scss';
import Form from 'react-bootstrap/Form';
// import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
// import InputGroup from 'react-bootstrap/InputGroup';

function JoinLeague() {
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };

    const [leagues, setLeagues] = useState([]);

    const getLeagues = () => {
        fetch(`${process.env.REACT_APP_API_URL}/league/find/all`, {
            method: 'GET',
        }).then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    console.log(data);
                    setLeagues(data);
                });
            } else {
                res.text().then((text) => {
                    console.log(text);
                });
            }
        }).catch((err) => console.log(err));
    };

    useEffect(() => {
        getLeagues();
    });
    console.log('Final Leagues: \n');
    console.log(leagues);

    return (
        <div>
            <div>
                <div className="join-league-form-title" noValidate validated={validated} onSubmit={handleSubmit} />
                <Row>
                    <Col>
                        <h2 className="order-title">Join a League</h2>
                    </Col>
                    <Col sm={2}>
                        <Button type="submit" onClick={getLeagues}>Refresh</Button>
                    </Col>
                </Row>
            </div>

            <Form className="join-league-form">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>League Name</th>
                            <th>End Date</th>
                            <th>Members</th>
                            <th> Join</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            leagues.map((item) => (
                                <tr>
                                    <td>
                                        {item.leagueName}
                                    </td>
                                    <td>
                                        {new Date(item.settings.endDate).toLocaleDateString('en-US')}
                                    </td>
                                    <td>
                                        {item.playerList.length}
                                        /
                                        {item.settings.maxPlayers}
                                    </td>
                                    <td>
                                        <Button type="submit">Join League</Button>
                                    </td>
                                </tr>
                            ))
                        }
                        {/* <tr>
                            <td>League Name 1</td>
                            <td> 10/21 </td>
                            <td> 10 </td>
                            <td>
                                <Button type="submit">Join League</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>League Name 2</td>
                            <td>3/20</td>
                            <td> 7 </td>
                            <td>
                                <Button type="submit">Join League</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>League Name 3</td>
                            <td>8/24</td>
                            <td> 12 </td>
                            <td>
                                <Button type="submit">Join League</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>League Name 4</td>
                            <td>6/12</td>
                            <td> 13 </td>
                            <td>
                                <Button type="submit">Join League</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>League Name 5</td>
                            <td>9/30</td>
                            <td> 12 </td>
                            <td>
                                <Button type="submit">Join League</Button>
                            </td>
                        </tr> */}
                    </tbody>
                </Table>

                <Form.Group controlId="Private Key">
                    <Row>
                        <Form.Label>
                            Private Key:
                        </Form.Label>
                        <Col>
                            <Form.Control type="text" placeholder="Enter League Name here..." required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a League Name.
                            </Form.Control.Feedback>
                        </Col>
                        <Col>
                            <Form.Control type="text" placeholder="Enter private key here" required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a Private Key.
                            </Form.Control.Feedback>
                        </Col>
                        <Col>
                            <Button type="submit">Join League</Button>
                        </Col>
                    </Row>
                </Form.Group>
            </Form>
        </div>

    );
}

export default JoinLeague;
