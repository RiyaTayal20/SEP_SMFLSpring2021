import { React, useState, useEffect } from 'react';
import Positions from './Sections/Positions';

const Portfolio = () => {
    const [league, setLeague] = useState();
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

    useEffect(() => {
        setLeague('Test League 4');
        getPortfolio();
    }, [league]);

    return (
        <div>
            <div className="portfolio-title">
                Portfolios
            </div>
            <Positions portfolio={portfolio} />
        </div>
    );
};

export default Portfolio;
