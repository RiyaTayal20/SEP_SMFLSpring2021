import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import '../../styles/JoinLeague/JoinLeague.scss';

function JoinLeague() {
    const [leagues, setLeagues] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [leagueKey, setLeagueKey] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    const handleClose = () => setShowModal(false);
    // const handleShow = () => setShow(true);

    const joinLeague = (league) => {
        fetch(`${process.env.REACT_APP_API_URL}/league/join`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                leagueName: league.leagueName,
                leagueKey,
            }),
        }).then((res) => {
            if (res.ok) {
                setShowAlert(true);
                setShowModal(false);
                res.json().then((data) => {
                    console.log(data);
                });
            } else {
                setShowError(true);
                setShowModal(false);
                res.text().then((text) => {
                    console.log(text);
                    setError(text);
                });
            }
        }).catch((err) => console.log(err));
    };

    const handleJoin = (league) => {
        console.log(league);
        setSelectedLeague(league);
        if (league.settings.public) joinLeague(league);
        else setShowModal(true);
    };

    const getLeagues = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/league/find/all`, {
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
            <Container className="join-league-container">
                <div className="join-league-form-title">
                    Join a League
                </div>
                {showAlert
                    && (
                        <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                            You successfully joined
                            {selectedLeague.leagueName}
                            !
                        </Alert>
                    )}
                {showError
                    && (
                        <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                            {error}
                        </Alert>
                    )}
                <Form className="join-league-form">
                    <Table striped bordered variant="light">
                        <thead>
                            <tr>
                                <th>League Name</th>
                                <th>End Date</th>
                                <th>Members</th>
                                <th>Type</th>
                                <th>Join</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leagues && leagues.map((league) => (
                                <tr>
                                    <td>{league.leagueName}</td>
                                    <td>
                                        {`${new Date(league.settings.endDate).getMonth() + 1
                                        }/${new Date(league.settings.endDate).getDate() + 1}/${new Date(league.settings.endDate).getFullYear()}`}
                                    </td>
                                    <td>
                                        {league.playerList.length}
                                        /
                                        {league.settings.maxPlayers}
                                    </td>
                                    {league.settings.public
                                        ? <td>Public</td>
                                        : <td>Private</td>}
                                    <td>
                                        <Button onClick={() => handleJoin(league)}>
                                            Join League
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Form>
                <Modal show={showModal} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedLeague.leagueName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form className="private-league-form">
                            <Form.Group controlId="formBasicUsername">
                                <Form.Label>Private Key:</Form.Label>
                                <Form.Control type="password" placeholder="Enter league key..." onChange={(e) => setLeagueKey(e.target.value)} />
                            </Form.Group>

                            <Button onClick={() => joinLeague(selectedLeague)}>Join</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
}

export default JoinLeague;
