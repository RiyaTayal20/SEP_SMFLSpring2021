import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Alert from 'react-bootstrap/Alert';
// import Col from 'react-bootstrap/Col';
// import Row from 'react-bootstrap/Row';
// import InputGroup from 'react-bootstrap/InputGroup';
import '../../styles/LeagueManagement/LeagueManagement.scss';
import { Dropdown } from 'react-bootstrap';

function LeagueManagement() {
    const username = sessionStorage.getItem('username');

    const [leagues, setLeagues] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [amt, setAmount] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showError, setShowError] = useState(false);
    const [notifMessage, setNotifMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
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

        if (response.status === 200) {
            const indexSelectedPlayer = selectedLeague.playerList.indexOf(player);
            const indexSelectedLeague = leagues.indexOf(selectedLeague);

            const newLeagues = leagues;
            const newSelectedLeague = selectedLeague;
            setLeagues([]);
            setSelectedLeague([]);

            newLeagues[indexSelectedLeague].playerList.splice(indexSelectedPlayer, 1);
            newSelectedLeague.playerList.splice(indexSelectedPlayer, 1);
            setLeagues(newLeagues);
            setSelectedLeague(newSelectedLeague);

            const thing = await response.text().then((res) => res).catch((err) => err.toString());
            setShowError(false);
            setNotifMessage(thing);
            setShowAlert(true);
        } else {
            setShowAlert(false);
            setNotifMessage('');
            setShowError(true);
        }
    };

    const handleGiveMoney = (player) => {
        console.log(player);
        setSelectedPlayer(player);
        setShowModal(true);
    };

    const addMoney = async (player, leagueName, amount) => {
        const response = await fetch(`${process.env.REACT_APP_LAPI_URL}/league/${leagueName}/donate`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: player,
                cash: amount,
            }),
        });
        if (response.status === 200) {
            const thing = await response.text().then((res) => res).catch((err) => err.toString());
            console.log(thing);
            setShowError(false);
            setNotifMessage(thing);
            setShowAlert(true);
        } else {
            setShowAlert(false);
            setNotifMessage('');
            setShowError(true);
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
                    {showAlert
                    && (
                        <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                            {notifMessage}
                        </Alert>
                    )}
                    {showError
                    && (
                        <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                            Unable to perform requested action!
                        </Alert>
                    )}
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
                                        &nbsp;&nbsp;&nbsp;
                                        <Button onClick={() => handleGiveMoney(player)}>Give Money</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Form>
                <Modal show={showModal} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedPlayer.username}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form className="add-money-form">
                            <Form.Group controlId="giveMoney">
                                <Form.Label>Give Money:</Form.Label>
                                <Form.Control type="number" step="0.01" placeholder="Enter amount..." onChange={(e) => setAmount(e.target.value)} />
                            </Form.Group>
                            <Button onClick={() => addMoney(selectedPlayer, selectedLeague.leagueName, amt)}>Give</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
}
export default LeagueManagement;
