import React from 'react';
import {
    Container, Row, Col,
} from 'react-bootstrap';

const StockStatistics = (props) => {
    const { statistics } = props;
    return (
        <Container fluid="md">
            <Row>
                <Col>
                    <b>Previous Close:&nbsp;</b>
                    {statistics.previousClose}
                </Col>
                <Col>
                    <b>Market Cap:&nbsp;</b>
                    {statistics.marketCap}
                </Col>
            </Row>
            <Row>
                <Col>
                    <b>Open:&nbsp;</b>
                    {statistics.openPrice}
                </Col>
                <Col>
                    <b>Beta:&nbsp;</b>
                    {statistics.beta}
                </Col>
            </Row>
            <Row>
                <Col>
                    <b>PE Ratio:&nbsp;</b>
                    {statistics.peRatio}
                </Col>
                <Col>
                    <b>EPS:&nbsp;</b>
                    {statistics.eps}
                </Col>
            </Row>
            <Row>
                <Col>
                    <b>Year Range:&nbsp;</b>
                    {statistics.week52Low}
                    &nbsp;-&nbsp;
                    {statistics.week52High}
                </Col>
                <Col>
                    <b>Dividend:&nbsp;</b>
                    {statistics.dividend}
                </Col>
            </Row>
            <Row>
                <Col>
                    <b>Volume:&nbsp;</b>
                    {statistics.volume}
                </Col>
                <Col>
                    <b>Average Volume:&nbsp;</b>
                    {statistics.avgVolume}
                </Col>
            </Row>
            <Row>
                <Col>
                    <b>Earnings Date:&nbsp;</b>
                    {statistics.earningsDate}
                </Col>
            </Row>
        </Container>
    );
};
export default StockStatistics;
