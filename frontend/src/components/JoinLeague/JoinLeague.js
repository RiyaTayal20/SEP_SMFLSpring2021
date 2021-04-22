import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
// eslint-disable-next-line import/no-unresolved
import { Check } from 'react-bootstrap-icons';
import '../../styles/JoinLeague/JoinLeague.scss';

function JoinLeague() {
    /* eslint-disable max-len */
    const username = sessionStorage.getItem('username');
    const [allLeagues, setAllLeagues] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [leagueKey, setLeagueKey] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    const [showFilter, setShowFilter] = useState(false);
    const [nameFilter, setNameFilter] = useState('');
    const [visFilter, setVisFilter] = useState('Both');
    const [minTradeLimitFilter, setMinTradeLimitFilter] = useState(null);
    const [maxTradeLimitFilter, setMaxTradeLimitFilter] = useState(null);
    const [minBalanceFilter, setMinBalanceFilter] = useState(null);
    const [maxBalanceFilter, setMaxBalanceFilter] = useState(null);
    const [earlyStartFilter, setEarlyStartFilter] = useState('');
    const [lateStartFilter, setLateStartFilter] = useState('');
    const [earlyEndFilter, setEarlyEndFilter] = useState('');
    const [lateEndFilter, setLateEndFilter] = useState('');
    const [hideFull, setHideFull] = useState(false);
    const [hideJoined, setHideJoined] = useState(false);

    const [ascending, setReversed] = useState(false);
    const [currentSort, setCurrentSort] = useState('');

    const handleClose = () => setShowModal(false);
    const handleFilterClose = () => setShowFilter(false);

    const resetFilter = () => {
        setShowFilter(false);
        setNameFilter('');
        setVisFilter('both');

        setMinTradeLimitFilter(null);
        setMaxTradeLimitFilter(null);
        setMinBalanceFilter(null);
        setMaxBalanceFilter(null);

        setEarlyStartFilter('');
        setLateStartFilter('');
        setEarlyEndFilter('');
        setLateEndFilter('');

        setHideFull(false);
        setHideJoined(false);
        setLeagues(allLeagues);
    };

    const applyFilter = () => {
        const list = allLeagues;
        const filteredLeagues = list.filter((league) => {
            /*
            *   if (filterIsUsed && !(filterSatified)) {
            *       return false;
            *   }
            */
            if (nameFilter.length !== 0 && !league.leagueName.includes(nameFilter)) {
                return false;
            }
            if ((visFilter === 'public' && !league.settings.public)) {
                return false;
            }
            if ((visFilter === 'private' && league.settings.public)) {
                return false;
            }

            if (minTradeLimitFilter && !(league.settings.tradeLimit >= minTradeLimitFilter)) {
                return false;
            }
            if (maxTradeLimitFilter && !(league.settings.tradeLimit <= maxTradeLimitFilter)) {
                return false;
            }

            if (minBalanceFilter && !(league.settings.balance >= minBalanceFilter)) {
                return false;
            }
            if (maxBalanceFilter && !(league.settings.balance <= maxBalanceFilter)) {
                return false;
            }

            if (earlyStartFilter && !(league.settings.startDate >= earlyStartFilter)) {
                return false;
            }
            if (lateStartFilter && !(league.settings.startDate <= lateStartFilter)) {
                return false;
            }
            if (earlyEndFilter && !(league.settings.endDate >= earlyEndFilter)) {
                return false;
            }
            if (lateEndFilter && !(league.settings.endDate <= lateEndFilter)) {
                return false;
            }

            if (hideFull && !(league.playerList.length < league.settings.maxPlayers)) {
                return false;
            }
            if (hideJoined && league.playerList.includes(username)) {
                return false;
            }

            return true;
        });
        setLeagues(filteredLeagues);
    };

    const joinLeague = (league) => {
        fetch(`${process.env.REACT_APP_LAPI_URL}/league/join`, {
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
                setShowError(false);
                setShowModal(false);
                setShowAlert(true);
                res.json().then((data) => {
                    console.log(data);
                });
            } else {
                setShowAlert(false);
                setShowModal(false);
                setShowError(true);
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
        const response = await fetch(`${process.env.REACT_APP_LAPI_URL}/league/find/all`, {
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
        const reqLeagues = await getLeagues();
        setLeagues(reqLeagues);
        setAllLeagues(reqLeagues);
    };

    useEffect(() => {
        loadLeagues();
    }, []);

    const nameSort = () => {
        if (currentSort === 'name') {
            setReversed(!ascending);
        } else {
            setReversed(false);
            setCurrentSort('name');
        }

        if (leagues) {
            leagues.sort((a, b) => {
                if (a.leagueName.toLowerCase() > b.leagueName.toLowerCase()) {
                    return 1;
                }
                return -1;
            });

            if (ascending) {
                leagues.reverse();
            }
        }
    };

    const startingBalanceSort = () => {
        if (currentSort === 'balance') {
            setReversed(!ascending);
        } else {
            setReversed(false);
            setCurrentSort('balance');
        }

        if (leagues) {
            leagues.sort((a, b) => {
                if (a.settings.balance > b.settings.balance) {
                    return 1;
                }
                return -1;
            });

            if (ascending) {
                leagues.reverse();
            }
        }
    };

    const tradeLimitSort = () => {
        if (currentSort === 'trade') {
            setReversed(!ascending);
        } else {
            setReversed(false);
            setCurrentSort('trade');
        }

        if (leagues) {
            leagues.sort((a, b) => {
                if (a.settings.tradeLimit > b.settings.tradeLimit) {
                    return 1;
                }
                return -1;
            });

            if (ascending) {
                leagues.reverse();
            }
        }
    };

    const startDateSort = () => {
        if (currentSort === 'startDate') {
            setReversed(!ascending);
        } else {
            setReversed(false);
            setCurrentSort('startDate');
        }

        if (leagues) {
            leagues.sort((a, b) => {
                if (a.settings.startDate > b.settings.startDate) {
                    return 1;
                }
                return -1;
            });

            if (ascending) {
                leagues.reverse();
            }
        }
    };

    const endDateSort = () => {
        if (currentSort === 'endDate') {
            setReversed(!ascending);
        } else {
            setReversed(false);
            setCurrentSort('endDate');
        }

        if (leagues) {
            leagues.sort((a, b) => {
                if (a.settings.endDate > b.settings.endDate) {
                    return 1;
                }
                return -1;
            });

            if (ascending) {
                leagues.reverse();
            }
        }
    };

    const visibilitySort = () => {
        if (currentSort === 'vis') {
            setReversed(!ascending);
        } else {
            setReversed(false);
            setCurrentSort('vis');
        }

        if (leagues) {
            leagues.sort((a, b) => {
                if (a.settings.public > b.settings.public) {
                    return 1;
                }
                return -1;
            });

            if (ascending) {
                leagues.reverse();
            }
        }
    };

    if (currentSort === '') {
        nameSort();
    }

    return (
        <div className="join-league-page-container">
            <Container className="join-league-container">
                <div className="join-league-form-title">
                    Join a League
                </div>
                <div className="filtering-buttons">
                    <div className="set-filters">
                        <Button className="f-buttons" onClick={() => { setShowFilter(true); }}>
                            Set New Filters
                        </Button>
                    </div>
                    <div className="reset-filters">
                        <Button className="f-buttons" onClick={() => resetFilter()}>
                            Reset Filters
                        </Button>
                    </div>
                </div>
                {showAlert
                    && (
                        <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                            You successfully joined&nbsp;
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
                <Form className="join-league-form" style={{ width: '75vw' }}>
                    <Table striped bordered variant="light">
                        <thead>
                            <tr>
                                <th>League Name
                                    <Button onClick={() => nameSort()} className="filter-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--dark-grey-scale)" className="filter" viewBox="0 0 16 16">
                                            <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                                        </svg>
                                    </Button>
                                </th>
                                <th>Starting Balance
                                    <Button onClick={() => startingBalanceSort()} className="filter-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--dark-grey-scale)" className="filter" viewBox="0 0 16 16">
                                            <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                                        </svg>
                                    </Button>
                                </th>
                                <th>Trade Limit
                                    <Button onClick={() => tradeLimitSort()} className="filter-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--dark-grey-scale)" className="filter" viewBox="0 0 16 16">
                                            <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                                        </svg>
                                    </Button>
                                </th>
                                <th>Start Date
                                    <Button onClick={() => startDateSort()} className="filter-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--dark-grey-scale)" className="filter" viewBox="0 0 16 16">
                                            <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                                        </svg>
                                    </Button>
                                </th>
                                <th>End Date
                                    <Button onClick={() => endDateSort()} className="filter-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--dark-grey-scale)" className="filter" viewBox="0 0 16 16">
                                            <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                                        </svg>
                                    </Button>
                                </th>
                                <th>Members</th>
                                <th>Type
                                    <Button onClick={() => visibilitySort()} className="filter-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--dark-grey-scale)" className="filter" viewBox="0 0 16 16">
                                            <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                                        </svg>
                                    </Button>
                                </th>
                                <th>Join</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leagues && leagues.map((league) => {
                                const alreadyJoined = league.playerList.includes(username);
                                return (
                                    <tr>
                                        <td>{(() => {
                                            if (alreadyJoined) {
                                                return (
                                                    <div>
                                                        {league.leagueName}
                                                        <OverlayTrigger overlay={<Tooltip>You are already in this league.</Tooltip>}>
                                                            <Check />
                                                        </OverlayTrigger>
                                                    </div>
                                                );
                                            }
                                            return league.leagueName;
                                        }
                                        )()}
                                        </td>
                                        <td>
                                            {(() => (<div>{league.settings.balance}</div>))()}
                                        </td>
                                        <td>
                                            {(() => (<div>{league.settings.tradeLimit}</div>))()}
                                        </td>
                                        <td>
                                            {`${new Date(league.settings.startDate).getMonth() + 1
                                            }/${new Date(league.settings.startDate).getDate() + 1}/${new Date(league.settings.startDate).getFullYear()}`}
                                        </td>
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
                                        <td>{(() => {
                                            if (alreadyJoined) {
                                                return (
                                                    <Button style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Joined</Button>
                                                );
                                            }
                                            return (
                                                <Button onClick={() => handleJoin(league)}>
                                                    Join League
                                                </Button>
                                            );
                                        }
                                        )()}
                                        </td>
                                    </tr>
                                );
                            })}
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

                <Modal size="lg" show={showFilter} onHide={handleFilterClose} centered>
                    <Modal.Header className="filter-header" closeButton>
                        <Modal.Title> Filter Preferences </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form className="filter-form">
                            <Form.Group controlId="formLeagueName">
                                <Form.Label>League Name</Form.Label>
                                <Form.Control type="text" placeholder="Name" defaultValue={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
                            </Form.Group>
                            <Form.Group controlId="formVisibility">
                                <Form.Label>Visibility</Form.Label>
                                <Form.Control as="select" defaultValue={visFilter} onChange={(e) => setVisFilter(e.target.value)}>
                                    <option value="both">Both</option>
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="filter-form-field-container" controlId="formTradeLimit">
                                <div className="filter-form-title">
                                    <Form.Label>Trade Limit Range</Form.Label>
                                </div>
                                <div className="range">
                                    <Form.Control className="filter-form-fields" type="number" placeholder="0" defaultValue={minTradeLimitFilter} onChange={(e) => setMinTradeLimitFilter(e.target.value)} />
                                    <div className="spacing-between-fields">to</div>
                                    <Form.Control className="filter-form-fields" type="number" placeholder="0" defaultValue={maxTradeLimitFilter} onChange={(e) => setMaxTradeLimitFilter(e.target.value)} />
                                </div>
                            </Form.Group>
                            <Form.Group className="filter-form-field-container" controlId="formBalance">
                                <div className="filter-form-title">
                                    <Form.Label>Start Balance Range</Form.Label>
                                </div>
                                <div className="range">
                                    <Form.Control className="filter-form-fields" type="number" placeholder="0" defaultValue={minBalanceFilter} onChange={(e) => setMinBalanceFilter(e.target.value)} />
                                    <div className="spacing-between-fields">to</div>
                                    <Form.Control className="filter-form-fields" type="number" placeholder="0" defaultValue={maxBalanceFilter} onChange={(e) => setMaxBalanceFilter(e.target.value)} />
                                </div>
                            </Form.Group>
                            <Form.Group className="filter-form-field-container" controlId="formStart">
                                <div className="filter-form-title">
                                    <Form.Label>Start Date Range</Form.Label>
                                </div>
                                <div className="range">
                                    <Form.Control className="filter-form-fields" type="date" placeholder="01/01/2021" defaultValue={earlyStartFilter} onChange={(e) => setEarlyStartFilter(e.target.value)} />
                                    <div className="spacing-between-fields">to</div>
                                    <Form.Control className="filter-form-fields" type="date" placeholder="01/01/2021" defaultValue={lateStartFilter} onChange={(e) => setLateStartFilter(e.target.value)} />
                                </div>
                            </Form.Group>
                            <Form.Group className="filter-form-field-container" controlId="formEnd">
                                <Form.Label className="filter-form-title">End Date Range</Form.Label>
                                <div className="range">
                                    <Form.Control className="filter-form-fields" type="date" placeholder="01/01/2021" defaultValue={earlyEndFilter} onChange={(e) => setEarlyEndFilter(e.target.value)} />
                                    <div className="spacing-between-fields">to</div>
                                    <Form.Control className="filter-form-fields" type="date" placeholder="01/01/2021" defaultValue={lateEndFilter} onChange={(e) => setLateEndFilter(e.target.value)} />
                                </div>
                            </Form.Group>

                            <Form.Group controlId="formHideFull">
                                <Form.Check type="checkbox" label="Hide Full Leagues" defaultChecked={hideFull} onChange={() => setHideFull(!hideFull)} />
                            </Form.Group>
                            <Form.Group controlId="formHideJoined">
                                <Form.Check type="checkbox" label="Hide Joined Leagues" defaultChecked={hideJoined} onChange={() => setHideJoined(!hideJoined)} />
                            </Form.Group>

                            <div className="accept-filters">
                                <Button onClick={() => {
                                    applyFilter();
                                    console.log('Saved');
                                    handleFilterClose();
                                }}
                                >Set New Filter
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
}

export default JoinLeague;
