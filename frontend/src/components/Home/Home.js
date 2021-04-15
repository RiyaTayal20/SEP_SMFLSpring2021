import React, { useState } from 'react';
import '../../styles/Home/Home.scss';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';
import { Redirect } from 'react-router-dom';
import Icon from '../../assets/icons/user-profile.png';
import graphIcon from '../../assets/icons/graph-icon.png';

function Home() {
    const [tutorial, showTutorial] = useState(true);

    const handleClose = () => showTutorial(false);

    // const history = useHistory();
    if (!localStorage.getItem('token')) {
        return <Redirect to="/user/login" />;
    }
    // Pass this token into auth header when making requests
    // const token = localStorage.getItem('token');

    return (
        <div className="home-page">
            {tutorial
                && (
                    <Modal show={tutorial} onHide={handleClose} centered>
                        {/* eslint-disable max-len */}
                        <Modal.Header closeButton>
                            <Modal.Title>Tutorial</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Carousel>
                                <Carousel.Item>
                                    <img
                                        className="d-block w-100"
                                        src="placeholder"
                                        alt="First slide"
                                    />
                                    <Carousel.Caption>
                                        <h3>First slide label</h3>
                                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img
                                        className="d-block w-100"
                                        src="holder.js/800x400?text=Second slide&bg=282c34"
                                        alt="Second slide"
                                    />

                                    <Carousel.Caption>
                                        <h3>Second slide label</h3>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img
                                        className="d-block w-100"
                                        src="holder.js/800x400?text=Third slide&bg=20232a"
                                        alt="Third slide"
                                    />

                                    <Carousel.Caption>
                                        <h3>Third slide label</h3>
                                        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            </Carousel>
                        </Modal.Body>
                    </Modal>
                )}
            <div className="user-profile-section" style={{ justifyContent: 'center' }}>
                <div className="image-container">
                    <img src={Icon} alt="userProfile" className="user-profile-image" style={{ height: '230px', width: '230px' }} />
                </div>
                <Form.Group className="username">
                    <Form.Control
                        className="form"
                        type="text"
                        placeholder={sessionStorage.getItem('username')}
                        style={{
                            backgroundColor: 'var(--dark-scale-grey)',
                            borderRadius: '0rem',
                            border: 'none',
                            textAlign: 'center',
                            fontSize: '40px',
                        }}
                        readOnly
                    />
                </Form.Group>
            </div>
            <div className="league-information">
                <div className="tab-placeholder">
                    <Tabs defaultActiveKey="allLeaguesPerformance" id="uncontrolled-tab-example">
                        <Tab className="tab" eventKey="allLeaguesPerformance" title="All Leagues Performance">
                            <div className="graph-icon">
                                <img src={graphIcon} alt="performanceGraph" className="performance-graphs" style={{ height: '29vh', width: '38vw' }} />
                            </div>
                        </Tab>
                        <Tab className="tab" eventKey="leagueOne" title="League 1">
                            <div className="graph-icon">
                                <img src={graphIcon} alt="performanceGraph" className="performance-graphs" style={{ height: '29vh', width: '38vw' }} />
                            </div>
                        </Tab>
                        <Tab className="tab" eventKey="leagueTwo" title="League 2">
                            <div className="graph-icon">
                                <img src={graphIcon} alt="performanceGraph" className="performance-graphs" style={{ height: '29vh', width: '38vw' }} />
                            </div>
                        </Tab>
                        <Tab className="tab" eventKey="leagueThree" title="League 3">
                            <div className="graph-icon">
                                <img src={graphIcon} alt="performanceGraph" className="performance-graphs" style={{ height: '29vh', width: '38vw' }} />
                            </div>
                        </Tab>
                        <Tab className="tab" eventKey="leagueFour" title="League 4">
                            <div className="graph-icon">
                                <img src={graphIcon} alt="performanceGraph" className="performance-graphs" style={{ height: '29vh', width: '38vw' }} />
                            </div>
                        </Tab>
                    </Tabs>
                </div>
                <div className="transaction-placeholder">
                    <h2 className="history-text" style={{ fontWeight: 'bold' }}>League Activity:</h2>
                    <div className="transaction-container">
                        <div className="column-one">
                            <h5 className="title">Popular Buys</h5>
                            <p className="stock-title">AT&T</p>
                            <p className="stock-title">Wells Fargo</p>
                            <h5 className="title">3 Most Recent Trades</h5>
                            <p className="stock-title">Microsoft</p>
                            <p className="stock-title">Paypal</p>
                            <p className="stock-title">Tesla</p>
                        </div>
                        <div className="column-two">
                            <h5 className="title">Bought</h5>
                            <p className="stock-price">$20,023</p>
                            <p className="stock-price">$18,594</p>
                            <h5 className="title">Bought</h5>
                            <p className="stock-price">$2,018</p>
                            <p className="stock-price">$500</p>
                            <p className="stock-price">$11,014</p>
                        </div>
                        <div className="column-three">
                            <h5 className="title" style={{ color: 'white' }}>hello</h5>
                            <p>Trade</p>
                            <p>Trade</p>
                            <h5 className="title" style={{ color: 'white' }}>hello</h5>
                            <p>Trade</p>
                            <p>Trade</p>
                            <p>Trade</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Home;
