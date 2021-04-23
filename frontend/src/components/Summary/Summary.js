import React, { useState, useEffect } from 'react';
// import Form from 'react-bootstrap/Form';';
import '../../styles/Summary/Summary.scss';
// import { useHistory } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container';
import SummaryMetrics from './Sections/SummaryMetrics';
import SummaryGraph from './Sections/SummaryGraph';

function Summary() {
    /* eslint-disable max-len */
    const username = sessionStorage.getItem('username');
    const [league, setLeague] = useState(null);
    const [summary, setSummary] = useState();
    const [portfolio, setPortfolio] = useState();
    const [leagueList, setLeagueList] = useState();
    const [SPData, setSPData] = useState();
    const dates = ['4/19', '4/12', '4/5', '3/29', '3/22'];
    const [week, setWeek] = useState(dates[0]);
    const prices = '';

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

    const getPortfolio = async () => {
        const response = await fetch(`${process.env.REACT_APP_LAPI_URL}/league/portfolio/${league}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setPortfolio(data);
    };

    const getSP = async () => {
        const response = await fetch(`${process.env.REACT_APP_SAPI_URL}/equity/historical/SPY?timeframe=6m`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        const SPprices = [];
        const startDate = new Date(`${week}/21`);

        let month;
        let day;
        let dateString = `${startDate.getMonth()}/${startDate.getDate()}/${startDate.getFullYear()}`;

        for (let i = 0; i < 5; i += 1) {
            month = startDate.getMonth() + 1;
            if (month < 10) {
                month = `0${month.toString()}`;
            } else {
                month = month.toString();
            }
            day = startDate.getDate();
            if (day < 10) {
                day = `0${day.toString()}`;
            } else {
                day = day.toString();
            }

            dateString = `${startDate.getFullYear()}-${month}-${day}`;

            SPprices.push({
                date: dateString,
                close: data[dateString],
            });

            startDate.setTime(startDate.getTime() + (24 * 60 * 60 * 1000));
        }

        setSPData(SPprices);
    };

    const getSummary = async () => {
        const response = await fetch(`${process.env.REACT_APP_LAPI_URL}/league/summary/${league}?week=${week}/21`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setSummary(data);
    };

    useEffect(() => {
        getLeagues();
        if (league) {
            getSummary();
            getSP();
            getPortfolio();
        }
    }, [league, week]);

    return (
        <Container className="summary-page">
            <div className="dropdowns">
                <DropdownButton title={league || 'Choose League'} className="league-dropdown" size="lg">
                    {leagueList && leagueList.map((userLeague) => (
                        <Dropdown.Item onClick={(() => setLeague(userLeague.leagueName))}>
                            {userLeague.leagueName}
                        </Dropdown.Item>
                    ))}
                </DropdownButton>
                <DropdownButton title={week} className="week-dropdown" size="lg">
                    {dates.map((date) => (
                        <Dropdown.Item onClick={(() => setWeek(date))}>
                            {date}
                        </Dropdown.Item>
                    ))}
                </DropdownButton>
            </div>
            {league && (
                <div className="league-summary">
                    <h1>Summary of Week <b>{week}:</b></h1>
                    <div className="league-graph-metrics">
                        <SummaryMetrics metrics={summary} />
                        <SummaryGraph className="league-graph" dates={dates} portfolio={portfolio} prices={prices} SPData={SPData} />
                    </div>
                </div>
            )}
        </Container>
    );
}

export default Summary;
