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

        const data = await response.json();
        return data.filter((league) => league.leagueManager === username);
    };

    const loadLeagues = async () => {
        setLeagues(await getLeagues());
        console.log(leagues);
    };

    useEffect(() => {
        loadLeagues();
    }, []);

    const kickPlayer = async (player, leagueName) => {
        console.log(`kick was called Player=${player}, league=${leagueName}`);
        const response = await fetch(`${process.env.REACT_APP_LAPI_URL}/league/${leagueName}/kick`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: player,
            }),
        });

        console.log(response);

        if (response.status === 200) {
            const indexSelectedPlayer = selectedLeague.playerList.indexOf(player);
            const indexSelectedLeague = leagues.indexOf(selectedLeague);

            const newLeagues = leagues;
            const newSelectedLeague = selectedLeague;
            setLeagues([]);
            setSelectedLeague([]);
            newLeagues[indexSelectedLeague].playerList.splice(indexSelectedPlayer, 1);
            newSelectedLeague.playerList.splice(indexSelectedPlayer, 1);
            console.log(newLeagues);
            console.log(newSelectedLeague);
            setLeagues(newLeagues);
            setSelectedLeague(newSelectedLeague);
            console.log('New player lists:');
            console.log(leagues[indexSelectedLeague].playerList);
            console.log(selectedLeague.playerList);
        }
    };

    if (leagues.length === 0) {
        return (
            <div className="no-leagues-title">
                You are not managing any leagues!
            </div>
        );
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
                        <tbody className="table-body">
                            {selectedLeague && selectedLeague.playerList
                            && selectedLeague.playerList.map((player) => (
                                <tr>
                                    <td>
                                        {player}
                                    </td>
                                    <td>
                                        {(() => {
                                            if (player === selectedLeague.leagueManager) {
                                                return (<Button style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Kick</Button>);
                                            }
                                            /* eslint max-len: 0 */
                                            return (<Button onClick={() => kickPlayer(player, selectedLeague.leagueName)}>Kick</Button>);
                                        })()}
                                        &nbsp;&nbsp;&nbsp;<Button>Give Money</Button>
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
