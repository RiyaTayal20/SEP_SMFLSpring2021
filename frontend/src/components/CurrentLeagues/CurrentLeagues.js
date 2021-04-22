import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import '../../styles/CurrentLeagues/CurrentLeagues.scss';

function CurrentLeagues() {
    const username = sessionStorage.getItem('username');

    const [showError, setShowError] = useState(false);
    const [leagues, setLeagues] = useState([]);

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
            <Container className="current-leagues-container">
                {showError
                    && (
                        <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                            <Alert.Heading>Alert</Alert.Heading>
                        </Alert>
                    )}
                <div className="current-leagues-title">
                    Current Leagues
                </div>
                <ListGroup className="league-list">
                    {leagues && leagues.map((league) => (
                        <ListGroup.Item>
                            <Link to={
                                {
                                    pathname: '/centralizedleague',
                                    state: { league: league.leagueName },
                                }
                            }
                            >
                                <p className="current-league-name">{league.leagueName}</p>
                            </Link>
                            {league.portfolioList
                                && league.portfolioList.map((portfolio) => {
                                    console.log(portfolio);
                                    if (portfolio.owner === username) {
                                        console.log(portfolio.netWorth);
                                        return (<p className="current-league-worth">${portfolio.currentNetWorth.toFixed(2)}({portfolio.currentNetWorth / league.settings.balance > 1 ? `+${parseFloat((portfolio.currentNetWorth / league.settings.balance - 1) * 100).toFixed(2)}%` : `-${parseFloat((1 - portfolio.currentNetWorth / league.settings.balance) * 100).toFixed(2)}%` })</p>);
                                    }
                                    return null;
                                })}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Container>
        </div>
    );
}

export default CurrentLeagues;
