import { React, useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container';
import Positions from './Sections/Positions';
import '../../styles/Portfolio/Portfolio.scss';

const Portfolio = () => {
    const username = sessionStorage.getItem('username');

    const [league, setLeague] = useState(null);
    const [leagueList, setLeagueList] = useState();
    const [portfolio, setPortfolio] = useState();

    const getPortfolio = async () => {
        const response = await fetch(`${process.env.REACT_APP_LAPI_URL}/league/portfolio/${league}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        setPortfolio(await response.json());
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

    useEffect(() => {
        getLeagues();
        getPortfolio();
    }, [league]);

    return (
        <div>
            <Container className="portfolio-container">
                <div className="portfolio-title">
                    Portfolios
                </div>
                {leagueList
                    && (
                        <DropdownButton title={league || 'Choose League'} className="portfolio-dropdown" size="lg">
                            {leagueList && leagueList.map((userLeague) => (
                                <Dropdown.Item onClick={(() => setLeague(userLeague.leagueName))}>
                                    {userLeague.leagueName}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    )}
                <Positions portfolio={portfolio} />
            </Container>
        </div>
    );
};

export default Portfolio;
