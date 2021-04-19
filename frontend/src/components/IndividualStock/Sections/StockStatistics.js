import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

const StockStatistics = (props) => {
    const [tooltips, setTooltips] = useState();
    /* eslint-disable max-len */
    const { statistics } = props;

    const getTooltips = async () => {
        const response = await fetch(`${process.env.REACT_APP_LAPI_URL}/tooltips/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setTooltips(data);
    };

    const popover = (title, term) => (
        <Popover>
            <Popover.Title>{title || 'Loading...'}</Popover.Title>
            <Popover.Content>
                {tooltips && (
                    <div>
                        <div>{tooltips[term].definition}</div>
                        <a href={tooltips[term].url}>Read more</a>
                    </div>
                )}
            </Popover.Content>
        </Popover>
    );

    useEffect(() => {
        getTooltips();
    }, []);

    return (
        <Table className="stats-table" responsive>
            <tbody>
                <tr>
                    <td>
                        <OverlayTrigger rootClose trigger="click" overlay={popover('Previous Close', 'previousclose')}>
                            <b>Previous Close:&nbsp;</b>
                        </OverlayTrigger>
                        ${statistics.previousClose}
                    </td>
                    <td>
                        <OverlayTrigger rootClose trigger="click" overlay={popover('Market Capitalization', 'marketcapitalization')}>
                            <b>Market Cap:&nbsp;</b>
                        </OverlayTrigger>
                        {statistics.marketCap.toLocaleString()}
                    </td>
                </tr>
                <tr>
                    <td>
                        <OverlayTrigger rootClose trigger="click" overlay={popover('Opening Price', 'openingprice')}>
                            <b>Open:&nbsp;</b>
                        </OverlayTrigger>
                        ${statistics.openPrice}
                    </td>
                    <td>
                        <OverlayTrigger rootClose trigger="click" overlay={popover('52-Week Range', '52weekhighlow')}>
                            <b>52-Week Range:&nbsp;</b>
                        </OverlayTrigger>
                        ${statistics.week52Low}-${statistics.week52High}
                    </td>
                </tr>
                <tr>
                    <td>
                        <OverlayTrigger rootClose trigger="click" overlay={popover('PE Ratio', 'price-earningsratio')}>
                            <b>P/E Ratio:&nbsp;</b>
                        </OverlayTrigger>
                        {statistics.peRatio}
                    </td>
                    <td>
                        <OverlayTrigger rootClose trigger="click" overlay={popover('Earnings Per Share', 'eps')}>
                            <b>EPS:&nbsp;</b>
                        </OverlayTrigger>
                        ${statistics.eps}
                    </td>
                </tr>
                <tr>
                    <td>
                        <OverlayTrigger rootClose trigger="click" overlay={popover('Volume', 'volume')}>
                            <b>Volume:&nbsp;</b>
                        </OverlayTrigger>
                        {statistics.volume.toLocaleString()}
                    </td>
                    <td>
                        <OverlayTrigger rootClose trigger="click" overlay={popover('Average Volume', 'averagedailytradingvolume')}>
                            <b>Average Volume:&nbsp;</b>
                        </OverlayTrigger>
                        {statistics.avgVolume.toLocaleString()}
                    </td>
                </tr>
                <tr>
                    <td>
                        <OverlayTrigger rootClose trigger="click" overlay={popover('Earnings Announcement', 'earnings-announcement')}>
                            <b>Earnings Date:&nbsp;</b>
                        </OverlayTrigger>
                        {statistics.earningsDate}
                    </td>
                    <td>
                        <OverlayTrigger rootClose trigger="click" overlay={popover('Beta', 'beta')}>
                            <b>Beta:&nbsp;</b>
                        </OverlayTrigger>
                        {statistics.beta}
                    </td>
                </tr>
            </tbody>
        </Table>
    );
};
export default StockStatistics;
