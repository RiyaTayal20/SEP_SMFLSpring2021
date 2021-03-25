import { React } from 'react';
import Positions from './Sections/Positions';

const Portfolio = () => {
    const username = sessionStorage.getItem('username');

    return (
        <div>
            <div className="portfolio-title">
                Portfolios
            </div>
            <Positions username={username} />
        </div>
    );
};

export default Portfolio;
