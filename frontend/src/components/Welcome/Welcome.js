import React from 'react';
import '../../styles/Welcome/Welcome.scss';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Icon from '../../assets/icons/diamondHandsLogo.png';
import Icon2 from '../../assets/icons/Piecharts.png';
import Icon3 from '../../assets/icons/Books.png';
import Icon4 from '../../assets/icons/Moneybag.png';

function Welcome() {
    return (
        <div>
            <Container className="one-cont">
                <div className="Page1">
                    <div className="main-Icon">
                        <img src={Icon} alt="logo" className="icon" style={{ width: '430px', height: '430px' }} />
                    </div>
                    <div className="all-buttons">
                        <Button className="reg-button" variant="outline-primary" size="lg">Register</Button>{' '}
                        <Button className="log-button" variant="outline-primary" size="lg">Login</Button>{' '}
                    </div>
                </div>
            </Container>

            <Container className="two-cont" style={{ backgroundColor: '#3fc380' }}>
                <div className="Page2" style={{ color: '#2f2f31' }}>
                    <h1 style={{ Color: '#2f2f31' }}>Successful investing is about managing risk, not avoiding it</h1>
                    <Row className="market">
                        <Col>
                            <h2>Real Market Success </h2>
                            <img src={Icon4} alt="logo" className="icon" style={{ width: '430px', height: '430px' }} />
                            <h3>
                                Make trades in a virtual environment before risking your own capital
                            </h3>
                            <h2>Test Your Trading Skills </h2>
                            <img src={Icon3} alt="logo" className="icon" style={{ width: '430px', height: '430px' }} />
                            <h3>
                                Join or create leagues with your friends and other investors.
                                Compete to see who has the best investment result daily
                            </h3>
                        </Col>
                    </Row>
                    <Row className="education">
                        <Col>
                            <h2>Education </h2>
                            <img src={Icon2} alt="logo" className="icon" style={{ width: '430px', height: '430px' }} />
                            <h3>
                                Learn more and grow. Increase your knowledge of the
                                stock markets by playing this virtual stock market exchange game.
                            </h3>
                            <h2>AI Bot </h2>
                            <h3>
                                Compete with the best!
                                AI BOTs allow investors to keep up with new trends
                                and have an easier approach on global markets
                            </h3>
                        </Col>
                    </Row>
                </div>

            </Container>

        </div>

    );
}
export default Welcome;
