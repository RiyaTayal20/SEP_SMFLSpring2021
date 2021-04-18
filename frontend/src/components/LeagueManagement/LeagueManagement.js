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
    const [selectedLeague, setSelectedLeague] = useState('');
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

        const data = (await response.json()).filter((league) => league.leagueManager === username);
        return data;
    };

    const loadLeagues = async () => {
        setLeagues(await getLeagues());
        console.log(leagues);
    };

    useEffect(() => {
        loadLeagues();
    }, []);

    if (!leagues) {
        return (
            <div>
                YOU ARENT MANAGING ANY LEAGUES
            </div>
        );
    }

    console.log(selectedLeague);
    if (selectedLeague) {
        console.log('Selected League is ');
        console.log(selectedLeague.playerList);
    }
    return (
        <div>
            <Container className="manage-league-container">
                <div className="manage-league-form-title">
                    Manage Leagues
                </div>
                <Form>
                    <DropdownButton title={selectedLeague.leagueName || 'Select League'} className="league-manage-dropdown" size="lg">
                        {leagues && leagues.map((league) => (
                            <Dropdown.Item onClick={() => {
                                setSelectedLeague(league);
                            }}
                            >
                                {league.leagueName}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                    <Table striped bordered variant="light">
                        <thead>
                            <tr>
                                <th>Player Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedLeague && selectedLeague.playerList
                            && selectedLeague.playerList.map((player) => (
                                <tr>
                                    <td>
                                        {player}
                                    </td>
                                    <td>
                                        <Button style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Kick</Button> &nbsp;&nbsp;&nbsp;
                                        <Button style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Give Money</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Form>
            </Container>
        </div>
    );
}
export default LeagueManagement;
