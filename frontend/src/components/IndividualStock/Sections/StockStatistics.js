import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col,
} from 'react-bootstrap';
// import Modal from 'react-bootstrap/Modal';
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
        <Container fluid="md">
            <Row>
                <Col>
                    <OverlayTrigger rootClose trigger="click" overlay={popover('Previous Close', 'previousclose')}>
                        <b>Previous Close:&nbsp;</b>
                    </OverlayTrigger>
                    {statistics.previousClose}
                </Col>
                <Col>
                    <OverlayTrigger rootClose trigger="click" overlay={popover('Market Capitalization', 'marketcapitalization')}>
                        <b>Market Cap:&nbsp;</b>
                    </OverlayTrigger>
                    {statistics.marketCap}
                </Col>
            </Row>
            <Row>
                <Col>
                    <OverlayTrigger rootClose trigger="click" overlay={popover('Opening Price', 'openingprice')}>
                        <b>Open:&nbsp;</b>
                    </OverlayTrigger>
                    {statistics.openPrice}
                </Col>
                <Col>
                    <OverlayTrigger rootClose trigger="click" overlay={popover('Beta', 'beta')}>
                        <b>Beta:&nbsp;</b>
                    </OverlayTrigger>
                    {statistics.beta}
                </Col>
            </Row>
            <Row>
                <Col>
                    <OverlayTrigger rootClose trigger="click" overlay={popover('PE Ratio', 'price-earningsratio')}>
                        <b>PE Ratio:&nbsp;</b>
                    </OverlayTrigger>
                    {statistics.peRatio}
                </Col>
                <Col>
                    <OverlayTrigger rootClose trigger="click" overlay={popover('Earnings Per Share', 'eps')}>
                        <b>EPS:&nbsp;</b>
                    </OverlayTrigger>
                    {statistics.eps}
                </Col>
            </Row>
            <Row>
                <Col>
                    <OverlayTrigger rootClose trigger="click" overlay={popover('52-Week High/Low', '52weekhighlow')}>
                        <b>Year Range:&nbsp;</b>
                    </OverlayTrigger>
                    {statistics.week52Low}
                    &nbsp;-&nbsp;
                    {statistics.week52High}
                </Col>
                <Col>
                    <OverlayTrigger rootClose trigger="click" overlay={popover('Dividend', 'dividend')}>
                        <b>Dividend:&nbsp;</b>
                    </OverlayTrigger>
                    {statistics.dividend}
                </Col>
            </Row>
            <Row>
                <Col>
                    <OverlayTrigger rootClose trigger="click" overlay={popover('Volume', 'volume')}>
                        <b>Volume:&nbsp;</b>
                    </OverlayTrigger>
                    {statistics.volume}
                </Col>
                <Col>
                    <OverlayTrigger rootClose trigger="click" overlay={popover('Average Volume', 'averagedailytradingvolume')}>
                        <b>Average Volume:&nbsp;</b>
                    </OverlayTrigger>
                    {statistics.avgVolume}
                </Col>
            </Row>
            <Row>
                <Col>
                    <OverlayTrigger rootClose trigger="click" overlay={popover('Earnings Announcement', 'earnings-announcement')}>
                        <b>Earnings Date:&nbsp;</b>
                    </OverlayTrigger>
                    {statistics.earningsDate}
                </Col>
            </Row>
        </Container>
    );
};
export default StockStatistics;
