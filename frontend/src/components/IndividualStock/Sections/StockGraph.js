import React from 'react';
import { Line } from 'react-chartjs-2';

const StockGraph = (props) => {
    const { graph, color } = props;
    const days = Object.keys(graph);
    const prices = Object.values(graph);

    return (
        <div>
            <Line
                data={{
                    labels: days, // all x values
                    datasets: [
                        {
                            label: 'Price',
                            data: prices, // all y values
                            borderColor: color,
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
        </div>
    );
};

export default StockGraph;
