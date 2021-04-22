import React from 'react';
import { Line } from 'react-chartjs-2';

const SummaryGraph = (props) => {
    /* eslint-disable prefer-template */
    /* eslint-disable max-len */
    const { SPData, portfolio } = props;
    let dates;
    let SPprices;
    let portfolioPrices;
    let SPpercentages;
    let portfolioPercentages;

    if (SPData) {
        dates = SPData.map((day) => day.date);
        SPprices = SPData.map((day) => day.close);
        SPpercentages = SPprices.map((price) => price / SPprices[0]);
    }

    if (portfolio && portfolio.netWorth) {
        portfolioPrices = Object.keys(portfolio.netWorth).map((j) => portfolio.netWorth[j].worth);
        portfolioPercentages = portfolioPrices.map((price) => price / portfolioPrices[0]);
    }
    console.log(SPData);
    console.log(SPprices);

    return (
        <Line
            className="Graph"
            data={{
                labels: dates,
                datasets: [
                    {
                        label: 'S&P 500',
                        data: SPpercentages,
                        borderColor: 'rgba(98, 252, 3, 1)',
                        hoverBackgroundColor: 'blue',
                        fill: false,
                        borderWidth: 1,
                        lineTension: 0.1,
                    },
                    {
                        label: 'Portfolio',
                        data: portfolioPercentages,
                        borderColor: 'rgba(21, 235, 199, 1)',
                        hoverBackgroundColor: 'blue',
                        fill: false,
                        borderWidth: 1,
                        lineTension: 0.1,
                    },
                ],
            }}
            height={400}
            width={530}
            options={{
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
                            labelString: 'Return(%)',
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
    );
};

export default SummaryGraph;
