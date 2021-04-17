import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Articles from './Sections/Articles';
import '../../styles/News/News.scss';

function News() {
    const username = sessionStorage.getItem('username');

    const [league, setLeague] = useState('');
    const [leagueList, setLeagueList] = useState();
    const [articles, setArticles] = useState([]);

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

    const getNews = async () => {
        const response = await fetch(`${process.env.REACT_APP_LAPI_URL}/league/news/${league}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json()
            .then((result) => setArticles(result));
        return data;
    };

    useEffect(() => {
        getLeagues();
        getNews();
    }, [league]);

    return (
        <div>
            <Container className="news-container">
                <div className="news-title">
                    News
                </div>
                {leagueList
                    && (
                        <DropdownButton title={league || 'Choose League'} className="news-dropdown" size="lg">
                            {leagueList && leagueList.map((userLeague) => (
                                <Dropdown.Item onClick={(() => setLeague(userLeague.leagueName))}>
                                    {userLeague.leagueName}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    )}
                <Articles articles={articles} />
            </Container>
        </div>
    );
}

export default News;
