import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Positions from './Sections/Positions';
import PortfolioGraph from './Sections/PortfolioGraph';
import '../../styles/Portfolio/Portfolio.scss';

const Portfolio = () => {
    /* eslint-disable max-len */
    const username = sessionStorage.getItem('username');

    const location = useLocation();

    const [league, setLeague] = useState(null);
    const [leagueList, setLeagueList] = useState();
    const [portfolio, setPortfolio] = useState();
    const [lowBalance, setLowBalance] = useState(false);
    const [viewUser, setViewUser] = useState(username);
    const [leagueObj, setLeagueObj] = useState(null);

    const handleClose = () => setLowBalance(false);

    const getPortfolio = async () => {
        console.log(viewUser);
        const response = await fetch(`${process.env.REACT_APP_LAPI_URL}/league/specifiedportfolio/${league}/${viewUser}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setPortfolio(data);
        if (data.currentNetWorth < 600 && viewUser === username) {
            setLowBalance(true);
        }
    };

    const getLeagues = async () => {
        const response = await fetch(`${process.env.REACT_APP_LAPI_URL}/user/${username}/league`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json()
            .then((result) => setLeagueList(result));
        return data;
    };

    // Required to get playerlist and other users portfolios
    const getLeague = async () => {
        const response = await fetch(`${process.env.REACT_APP_LAPI_URL}/league/find/${league}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json()
            .then((result) => setLeagueObj(result));
        return data;
    };

    // Set league and username if sent in state
    useEffect(() => {
        console.log('loaded');
        console.log(location);
        if (location.state && 'selectedUser' in location.state) {
            setLeague(location.state.selectedUser.league);
            setViewUser(location.state.selectedUser.username);
        }
    }, []);

    useEffect(() => {
        getPortfolio();
    }, [viewUser]);

    useEffect(() => {
        getLeagues();
        getPortfolio();
        getLeague();
    }, [league]);

    return (
        <div>
            <Container className="portfolio-container">
                <div className="portfolio-title">
                    Portfolios
                </div>
                <Modal show={lowBalance} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Low Balance</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        You have a low balance. Please contact League Manager to get more money.
                    </Modal.Body>
                </Modal>
                {leagueList
                    && (
                        <div>
                            <DropdownButton title={league || 'Choose League'} className="portfolio-dropdown" size="lg">
                                {leagueList && leagueList.map((userLeague) => (
                                    <Dropdown.Item onClick={(() => setLeague(userLeague.leagueName))}>
                                        {userLeague.leagueName}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </div>
                    )}
                {leagueObj
                    && (
                        <div>
                            <DropdownButton title={viewUser || 'Choose Player'} className="portfolio-dropdown" size="lg">
                                {leagueObj && leagueObj.playerList.map((user) => (
                                    <Dropdown.Item onClick={(() => setViewUser(user))}>
                                        {user}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </div>
                    )}
                {league
                    && (
                        <div className="header">
                            <h1>
                                Portfolio for <b>{league}</b>
                            </h1>
                            <PortfolioGraph portfolio={portfolio} />
                            <Positions portfolio={portfolio} />
                        </div>
                    )}
            </Container>
        </div>
    );
};

export default Portfolio;
