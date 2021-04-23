import React from 'react';
import Container from 'react-bootstrap/Container';
import { Line } from 'react-chartjs-2';
import '../../../styles/Portfolio/PortfolioGraph.scss';

const PortfolioGraph = (props) => {
    /* eslint-disable max-len */
    const { portfolio, league } = props;
    let dates = '';
    let prices = '';
    let balance;
    if (league) {
        balance = league.settings.balance;
    }
    if (portfolio && portfolio.netWorth) {
        dates = Object.keys(portfolio.netWorth).map((i) => portfolio.netWorth[i].date.slice(0, portfolio.netWorth[i].date.lastIndexOf('T')));
        prices = Object.keys(portfolio.netWorth).map((j) => portfolio.netWorth[j].worth);
    }

    return (
        <Container className="portfolio-graph-container">
            {portfolio && portfolio.currentNetWorth
                && (
                    <div className="portfolio-header">
                        <h1 className="portfolio-current">${portfolio.currentNetWorth}</h1> &nbsp;
                        <p className="portfolio-gain"> Today&apos;s Gain: </p> &nbsp;
                        {portfolio.closePercentChange > 0
                            ? <p className="portfolio-gain" style={{ color: portfolio.closePercentChange > 0 ? 'green' : 'red' }}>${(portfolio.currentNetWorth * (portfolio.closePercentChange / 100)).toFixed(2)}&nbsp;(+{portfolio.closePercentChange}%)</p>
                            : <p className="portfolio-gain" style={{ color: portfolio.closePercentChange > 0 ? 'green' : 'red' }}>${(portfolio.currentNetWorth * (portfolio.closePercentChange / 100)).toFixed(2)}&nbsp;({portfolio.closePercentChange}%)</p> }
                        &nbsp; <p className="portfolio-gain">Total Gain: </p> &nbsp;
                        {portfolio.currentNetWorth - 500 > 0
                            ? <p className="portfolio-gain" style={{ color: portfolio.currentNetWorth - balance > 0 ? 'green' : 'red' }}>${(portfolio.currentNetWorth - balance).toFixed(2)}&nbsp;(+{portfolio.currentNetWorth / 500 > 1 ? `${parseFloat((portfolio.currentNetWorth / balance - 1) * 100).toFixed(2)}%` : `${parseFloat((1 - portfolio.currentNetWorth / balance) * 100).toFixed(2)}%` })</p>
                            : <p className="portfolio-gain" style={{ color: portfolio.currentNetWorth - balance > 0 ? 'green' : 'red' }}>${(portfolio.currentNetWorth - balance).toFixed(2)}&nbsp;({portfolio.currentNetWorth / 500 > 1 ? `${parseFloat((portfolio.currentNetWorth / balance - 1) * 100).toFixed(2)}%` : `${parseFloat((1 - portfolio.currentNetWorth / balance) * 100).toFixed(2)}%` })</p> }
                    </div>
                )}
            {portfolio && portfolio.netWorth
                && (
                    <Line
                        data={{
                            labels: dates, // all x values
                            datasets: [
                                {
                                    label: 'Portfolio Value',
                                    data: prices, // all y values
                                    borderColor: 'rgba(98, 252, 3, 1)',
                                    hoverBackgroundColor: 'blue',
                                    fill: false,
                                    borderWidth: 1,
                                    lineTension: 0.1,
                                },
                            ],
                        }}
                        height={300}
                        width={600}
                        options={{
                            backgroundColor: 'white',
                            maintainAspectRatio: true,
                            tooltips: {
                                backgroundColor: 'blue',
                            },
                            scales: {
                                yAxes: [{
                                    gridLines: {
                                        color: 'gray',
                                        zeroLineColor: 'white',
                                    },
                                    scaleLabel: {
                                        display: true,
                                        fontSize: 15,
                                        fontColor: 'white',
                                        fontStyle: 'bold',
                                        labelString: 'Value',
                                    },
                                    ticks: {
                                        fontColor: 'white',
                                    },
                                }],
                                xAxes: [{
                                    gridLines: {
                                        color: 'gray',
                                        zeroLineColor: 'white',
                                    },
                                    scaleLabel: {
                                        display: true,
                                        fontSize: 15,
                                        fontColor: 'white',
                                        fontStyle: 'bold',
                                        labelString: 'Date',
                                    },
                                    ticks: {
                                        fontColor: 'white',
                                    },
                                }],
                            },
                            legend: {
                                labels: {
                                    fontSize: 12,
                                    fontColor: 'white',
                                },
                            },
                        }}
                    />
                )}
        </Container>
    );
};
export default PortfolioGraph;
