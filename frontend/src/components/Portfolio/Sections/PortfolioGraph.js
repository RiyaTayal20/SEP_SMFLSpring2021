import React from 'react';
import Container from 'react-bootstrap/Container';
import { Line } from 'react-chartjs-2';
import '../../../styles/Portfolio/PortfolioGraph.scss';

const PortfolioGraph = (props) => {
    const { portfolio } = props;
    let dates = '';
    let prices = '';
    /* eslint-disable max-len */
    if (portfolio && portfolio.netWorth) {
        dates = Object.keys(portfolio.netWorth).map((i) => portfolio.netWorth[i].date.slice(0, portfolio.netWorth[i].date.lastIndexOf('T')));
        prices = Object.keys(portfolio.netWorth).map((j) => portfolio.netWorth[j].worth);
    }
    return (
        <Container className="portfolio-graph-container">
            {portfolio && portfolio.currentNetWorth
                && (
                    <div className="portfolio-header">
                        <h2>{portfolio.currentNetWorth}({portfolio.currentNetWorth / 500 > 1 ? `+${parseFloat((portfolio.currentNetWorth / 500 - 1) * 100).toFixed(2)}%` : `-${parseFloat((1 - portfolio.currentNetWorth / 500) * 100).toFixed(2)}%` })</h2>
                    </div>
                )}
            {portfolio && portfolio.netWorth
                && (
                    <Line
                        data={{
                            labels: dates, // all x values
                            datasets: [
                                {
                                    label: 'Price',
                                    data: prices, // all y values
                                    borderColor: 'rgba(98, 252, 3, 1)',
                                    hoverBackgroundColor: 'blue',
                                    fill: false,
                                    borderWidth: 1,
                                    lineTension: 0.1,
                                },
                            ],
                        }}
                        height={400}
                        width={600}
                        options={{
                            backgroundColor: 'white',
                            maintainAspectRatio: false,
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
                                        labelString: '$',
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
