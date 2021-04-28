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
        SPpercentages = SPprices.map((price) => (price / SPprices[0] - 1) * 100);
    }

    if (portfolio && portfolio.netWorth) {
        if (dates) {
            portfolio.netWorth = portfolio.netWorth.filter((item) => {
            // YYYY-MM-DD
            // Only 5 dates
                const checkDate = new Date(item.date);

                const startYear = parseInt((dates[0]).substring(0, 4), 10);
                const startMonth = parseInt(dates[0].substring(5, 7), 10);
                const startDay = parseInt(dates[0].substring(8), 10);
                const endYear = parseInt(dates[4].substring(0, 4), 10);
                const endMonth = parseInt(dates[4].substring(5, 7), 10);
                const endDay = parseInt(dates[4].substring(8), 10);

                const startDate = new Date(startYear, startMonth - 1, startDay);
                const endDate = new Date(endYear, endMonth - 1, endDay + 1);

                if (checkDate < startDate || checkDate > endDate.getTime()) {
                    return false;
                }
                return true;
            });
        }
        portfolioPrices = Object.keys(portfolio.netWorth).map((j) => portfolio.netWorth[j].worth);
        portfolioPercentages = portfolioPrices.map((price) => (price / portfolioPrices[0] - 1) * 100);
    }

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
            height={275}
            width={530}
            options={{
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
