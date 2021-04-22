import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

const SummaryMetrics = (props) => {
    /* eslint-disable max-len */
    const { metrics } = props;
    let percentageReturnPlace;
    let personalPercentageReturn;
    let personalDollarReturn;
    let SPReturnDifference;
    let leaguePercentageReturn;
    let leagueDollarReturn;
    let leagueDollarReturnDifference;
    let leaguePercentageReturnDifference;

    if (metrics) {
        percentageReturnPlace = metrics.percentageReturnPlace;
        personalPercentageReturn = metrics.personalPercentageReturn;
        personalDollarReturn = metrics.personalDollarReturn;
        SPReturnDifference = metrics.SPReturnDifference;
        leaguePercentageReturn = metrics.leaguePercentageReturn;
        leagueDollarReturn = metrics.leagueDollarReturn;
        leagueDollarReturnDifference = metrics.leagueDollarReturnDifference;
        leaguePercentageReturnDifference = metrics.leaguePercentageReturnDifference;
    }

    return (
        <ListGroup horizontal>
            <ListGroup.Item className="card-list">
                You rank in total return
                <h1 className="return-place">#{percentageReturnPlace}</h1>
            </ListGroup.Item>
            <ListGroup.Item className="card-list">
                Your return compared to the league
                {personalDollarReturn > 0
                    ? <h1 className="total-return" style={{ color: 'green' }}>$+{personalDollarReturn}(+{personalPercentageReturn}%)</h1>
                    : <h1 className="total-return" style={{ color: 'red ' }}>${personalDollarReturn}({personalPercentageReturn}%)</h1> }
            </ListGroup.Item>
            <ListGroup.Item className="card-list">
                Your return compared to the league
                {leagueDollarReturnDifference > 0
                    ? <h1 className="total-return" style={{ color: 'green' }}>$+{leagueDollarReturnDifference}(+{leaguePercentageReturnDifference}%)</h1>
                    : <h1 className="total-return" style={{ color: 'red ' }}>${leagueDollarReturnDifference}({leaguePercentageReturnDifference}%)</h1> }
            </ListGroup.Item>
            <ListGroup.Item className="card-list">
                The league&apos;s average return
                {leagueDollarReturn > 0
                    ? <h1 className="total-return" style={{ color: 'green' }}>$+{leagueDollarReturn}(+{leaguePercentageReturn}%)</h1>
                    : <h1 className="total-return" style={{ color: 'red ' }}>${leagueDollarReturn}({leaguePercentageReturn}%)</h1> }
            </ListGroup.Item>
            <ListGroup.Item className="card-list">
                Your return compared to the S&P 500
                <h1>{SPReturnDifference}%</h1>
            </ListGroup.Item>
        </ListGroup>
    );
};

export default SummaryMetrics;
