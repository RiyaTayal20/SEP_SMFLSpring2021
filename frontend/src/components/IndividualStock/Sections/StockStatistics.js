import React from 'react';
import {
    Container, Row, Col,
} from 'react-bootstrap';
import Table from 'react-bootstrap/Table';

const StockStatistics = (props) => {
    const { statistics } = props;
    return (
        <Container fluid="md">
            <Table striped bordered hover variant="light">
                <tbody>
                    <tr>
                        <td>statistics</td>
                    </tr>
                </tbody>
            </Table>
            <Row>
                <Col>
                    <b>Previous Close:&nbsp;</b>
                    ${statistics.previousClose}
                </Col>
                <Col>
                    <b>Market Cap:&nbsp;</b>
                    {statistics.marketCap.toLocaleString()}
                </Col>
            </Row>
            <Row>
                <Col>
                    <b>Open:&nbsp;</b>
                    ${statistics.openPrice}
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
                    <b>Earnings Per Share(EPS):&nbsp;</b>
                    {statistics.eps}
                </Col>
            </Row>
            <Row>
                <Col>
                    <b>52-Week High/Low:&nbsp;</b>
                    ${statistics.week52High}/${statistics.week52Low}
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
                    {statistics.avgVolume.toLocaleString()}
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
