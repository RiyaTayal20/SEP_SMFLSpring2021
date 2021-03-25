import { React, useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Positions from './Sections/Positions';
import '../../styles/Portfolio/Portfolio.scss';

const Portfolio = () => {
    const username = sessionStorage.getItem('username');

    const [league, setLeague] = useState('Test League 4');
    const [leagueList, setLeagueList] = useState();
    const [portfolio, setPortfolio] = useState();

    const getPortfolio = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/league/portfolio/${league}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        setPortfolio(await response.json());
    };

    const getLeagues = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${username}/league`, {
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

    // const loadLeagues = async () => {
    //     await setLeagueList(await getLeagues());
    // };

    useEffect(() => {
        getLeagues();
        getPortfolio();
    }, [league]);

    return (
        <div>
            <div className="portfolio-title">
                Portfolios
            </div>
            {leagueList
                && (
                    <DropdownButton title="Choose League">
                        {leagueList && leagueList.map((userLeague) => (
                            <Dropdown.Item onClick={(() => setLeague(userLeague.leagueName))}>
                                {userLeague.leagueName}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                )}
            <Positions portfolio={portfolio} />
        </div>
    );
};

export default Portfolio;
