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
import TutorialSlide1 from '../../assets/icons/CreateLeaguePage.png';
import TutorialSlide2 from '../../assets/icons/JoinLeaguePage.png';
import TutorialSlide3 from '../../assets/icons/PrivateJLModal.png';
import TutorialSlide4 from '../../assets/icons/JoinLeagueFilters.png';
import TutorialSlide5 from '../../assets/icons/FilterJLModal.png';
import TutorialSlide6 from '../../assets/icons/TradePage.png';

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
                    <Modal show={tutorial} onHide={handleClose} size="lg" centered>
                        {/* eslint-disable max-len */}
                        <Modal.Header closeButton>
                            <Modal.Title>Tutorial</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Carousel>
                                <Carousel.Item>
                                    <Carousel.Caption style={{ left: '1%' }}>
                                        <div className="carousel-caption2">
                                            <h3 className="carousel-caption-title">Create League Page</h3>
                                            <p className="carousel-caption-description">On this page you can create a new league. To navigate to this page refer to the location circled in red.</p>
                                        </div>
                                    </Carousel.Caption>
                                    <img src={TutorialSlide1} alt="First slide" />
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img src={TutorialSlide2} alt="Second slide" />
                                    <Carousel.Caption style={{ left: '1%' }}>
                                        <div className="carousel-caption2">
                                            <h3 className="carousel-caption-title">Join League Page</h3>
                                            <p className="carousel-caption-description">On this page you can create a new league. To navigate to this page refer to the location circled in red.</p>
                                        </div>
                                    </Carousel.Caption>
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img src={TutorialSlide3} alt="Third slide" />
                                    <Carousel.Caption style={{ left: '1%' }}>
                                        <div className="carousel-caption2">
                                            <h3 className="carousel-caption-title">Join Private League</h3>
                                            <p className="carousel-caption-description">When joining a private league, you must enter a private key that is given out by the League Manager.</p>
                                        </div>
                                    </Carousel.Caption>
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img src={TutorialSlide4} alt="Fourth slide" />
                                    <Carousel.Caption style={{ left: '1%' }}>
                                        <div className="carousel-caption2">
                                            <h3 className="carousel-caption-title">Sorting League Table</h3>
                                            <p className="carousel-caption-description">Click the filtering button in the columns to sort the table in ascending or descending order.</p>
                                        </div>
                                    </Carousel.Caption>
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img src={TutorialSlide5} alt="Fifth slide" />
                                    <Carousel.Caption style={{ left: '1%' }}>
                                        <div className="carousel-caption2">
                                            <h3 className="carousel-caption-title">Filtering League Table</h3>
                                            <p className="carousel-caption-description">Enter as much or as little information as you need to filter through the many join league options</p>
                                        </div>
                                    </Carousel.Caption>
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img src={TutorialSlide6} alt="Sixth slide" />
                                    <Carousel.Caption style={{ left: '1%' }}>
                                        <div className="carousel-caption2">
                                            <h3 className="carousel-caption-title">Trade Page</h3>
                                            <p className="carousel-caption-description">On this page you can make trades. To navigate to this page refer to the location circled in red.</p>
                                            <p className="carousel-caption-description"> DISCLAIMER: In a real market, orders are not fulfilled immediately.</p>
                                        </div>
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
