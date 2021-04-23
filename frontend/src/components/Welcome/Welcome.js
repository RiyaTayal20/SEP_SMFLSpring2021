import React from 'react';
import '../../styles/Welcome/Welcome.scss';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Icon from '../../assets/icons/diamondHandsLogo.png';
import Icon2 from '../../assets/icons/Piecharts.png';
import Icon3 from '../../assets/icons/Books.png';
import Icon4 from '../../assets/icons/Moneybag.png';
import Icon5 from '../../assets/icons/bot.png';
import Icon6 from '../../assets/icons/stairs.png';

function Welcome() {
    return (
        <div>
            <Container className="one-cont">
                <div>
                    <div className="big-logo">
                        <img src={Icon} alt="logo" className="icon" style={{ width: '430px', height: '430px' }} />
                    </div>
                    <div className="all-buttons">
                        <Button className="reg-button" variant="outline-primary" size="lg" href="/user/register">Register</Button>{' '}
                        <Button className="log-button" variant="outline-primary" size="lg" href="/user/login">Login</Button>{' '}
                    </div>
                </div>
            </Container>

            <div className="Page2" style={{ color: '#2f2f31', backgroundColor: '#3fc380' }}>
                <div>
                    <u><h1 style={{ Color: '#2f2f31' }}>Successful investing is about managing risk, not avoiding it</h1></u>
                </div>
                <Row className="market">
                    <Col className="market-col" xs={4}>
                        <Row>
                            <div className="page-sections">
                                <h2 className="real-title">Real Market Success </h2>
                                <img src={Icon4} alt="logo" className="icon" style={{ width: '300px', height: '200px' }} />
                                <h4 className="word" style={{ color: '#2f2f31' }}>
                                    Make trades in a virtual environment before
                                    risking your own capital
                                </h4>
                            </div>
                        </Row>
                        <Row>
                            <div className="page-sections">
                                <h2 className="test-title">Test Your Trading Skills </h2>
                                <img src={Icon3} alt="logo" className="icon" style={{ width: '300px', height: '200px' }} />
                                <h4 className="word" style={{ color: '#2f2f31' }}>
                                    Join or create leagues with your friends and other investors.
                                    Compete to see who has the best investment result daily
                                </h4>
                            </div>
                        </Row>
                    </Col>
                    <Col className="education-col" xs={5}>
                        <Row>
                            <div className="page-sections">
                                <h2 className="ed-title">Education</h2>
                                <img src={Icon2} alt="logo" className="icon" style={{ width: '250px', height: '200px' }} />
                                <h4 className="word" style={{ color: '#2f2f31' }}>
                                    Learn more and grow. Increase your knowledge of the
                                    stock markets by playing this virtual stock market
                                    exchange game.
                                </h4>
                            </div>
                        </Row>
                        <Row>
                            <div className="page-sections">
                                <h2 className="bot-title">AI Bot </h2>
                                <img src={Icon5} alt="logo" className="icon" style={{ width: '150px', height: '150px' }} />
                                <h4 className="word2" style={{ color: '#2f2f31' }}>
                                    Compete with the best!
                                    AI BOTs allow investors to keep up with new trends
                                    and have an easier approach on global markets
                                </h4>
                            </div>
                        </Row>
                    </Col>
                </Row>
            </div>
            <div className="expert" style={{ backgroundColor: '#5367fc' }}>
                <Col>
                    <Row>
                        <Card className="expert-card" style={{ borderRadius: '1.5rem' }}>
                            <Card.Body>
                                <h1 className="expert-text">Expert or Beginner this game is for you!</h1>
                                <h2 className="expert-text1">Create or join a league no matter what level you&apos;re on!</h2>
                                <img src={Icon6} alt="logo" className="stairs" style={{ width: '250px', height: '250px' }} />
                            </Card.Body>
                        </Card>
                    </Row>
                    <Row>
                        <div>
                            <Button className="reg-button1" variant="outline-primary" size="lg" href="/user/register">Register</Button>
                        </div>
                    </Row>
                </Col>
            </div>

            <div className="names">
                <Row>
                    <img src={Icon} alt="logo" className="icon" style={{ width: '70px', height: '70px' }} />
                    <h1 className="diamond-header">Diamond Hand Investment</h1>
                </Row>
                <Row>
                    <Col>
                        <h5 className="created">Created By:</h5>
                    </Col>
                    <Col className="name-list1">
                        <p>Aarushi Pandey</p>
                        <p>Aarushi Satish</p>
                        <p>Apoorva Goel</p>
                        <p>Christine Matthews</p>
                        <p>David Lau</p>
                        <p>Jacques Scheire</p>
                    </Col>
                    <Col className="name-list2">
                        <p>Jawad Jamal</p>
                        <p>Krishna Prajapati</p>
                        <p>Riya Tayal</p>
                        <p>Sahitya Gande</p>
                        <p>Yati Patel</p>
                        <p>Yatri Patel</p>
                    </Col>
                </Row>
            </div>

        </div>

    );
}
export default Welcome;
