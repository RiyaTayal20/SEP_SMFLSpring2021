import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import DropdownButton from 'react-bootstrap/DropdownButton';
// import Col from 'react-bootstrap/Col';
// import Row from 'react-bootstrap/Row';
// import InputGroup from 'react-bootstrap/InputGroup';
import '../../styles/LeagueManagement/LeagueManagement.scss';
import { Dropdown } from 'react-bootstrap';

function LeagueManagement() {
    const username = sessionStorage.getItem('username');

    const [leagues, setLeagues] = useState([]);
    // const [selectedLeague, setSelectedLeague] = useState('');
    // const [showModal, setShowModal] = useState(false);
    // const [leagueKey, setLeagueKey] = useState('');
    // const [showAlert, setShowAlert] = useState(false);
    // const [showError, setShowError] = useState(false);
    // const [error, setError] = useState('');

    const getLeagues = async () => {
        const response = await fetch(`${process.env.REACT_APP_LAPI_URL}/user/${username}/league`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    };

    const loadLeagues = async () => {
        setLeagues(await getLeagues());
        console.log(leagues);
    };

    useEffect(() => {
        loadLeagues();
    }, []);

    return (
        <div>
            <Container className="manage-league-container">
                <div className="manage-league-form-title">
                    Manage Leagues
                </div>
                <Form>
                    <DropdownButton title="Select League" className="league-manage-dropdown" size="lg">
                        {leagues && leagues.map((league) => {
                            if (league.leagueManager === username) {
                                return (<Dropdown.Item>{league.leagueName}</Dropdown.Item>);
                            }
                            return null;
                        })}
                    </DropdownButton>
                    <Table striped bordered variant="light">
                        <thead>
                            <tr>
                                <th>Player Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    Player 1
                                </td>
                                <td>
                                    <Button style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Kick</Button> &nbsp;&nbsp;&nbsp;
                                    <Button style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Give Money</Button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Player 2
                                </td>
                                <td>
                                    <Button style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Kick</Button> &nbsp;&nbsp;&nbsp;
                                    <Button style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Give Money</Button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Player 3
                                </td>
                                <td>
                                    <Button style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Kick</Button> &nbsp;&nbsp;&nbsp;
                                    <Button style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Give Money</Button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Player 4
                                </td>
                                <td>
                                    <Button style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Kick</Button> or
                                    <Button style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Give Money</Button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Form>
            </Container>
        </div>
    );
}

export default LeagueManagement;

