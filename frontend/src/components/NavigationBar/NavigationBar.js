import React from 'react';
import '../../styles/NavigationBar/NavigationBar.scss';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Icon from '../../assets/icons/dropdown-arrow.png';

function NavigationBar() {
    return (
        <Accordion className="sidebar" style={{ border: '4px' }}>
            <Card.Header className="card-header" style={{ backgroundColor: 'white' }}>
                <Card.Link className="card-link" href="/home" style={{ color: '#2F2F31' }}>Home</Card.Link>
            </Card.Header>
            <Card.Header className="card-header" style={{ backgroundColor: 'white' }}>
                <Card.Link href="/portfolio" style={{ color: '#2F2F31' }}>Portfolio</Card.Link>
            </Card.Header>
            <Card.Header className="card-header" style={{ backgroundColor: 'white' }}>
                <Card.Link href="/trade" style={{ color: '#2F2F31' }}>Trade</Card.Link>
            </Card.Header>
            <Accordion defaultActiveKey="0">
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0" style={{ color: '#2F2F31', backgroundColor: 'white' }}>
                        Leagues
                        <div className="arrow">
                            <img src={Icon} alt="dropdown-arrow" className="dropdown-icon" style={{ height: '10px', width: '10px' }} />
                        </div>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <ListGroup style={{ marginLeft: '20px', borderRadius: '0rem' }}>
                            <ListGroup.Item className="leagues-item">
                                <Card.Link href="/league/manage" style={{ color: '#2F2F31' }}>Manage Leagues</Card.Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="leagues-item">
                                <Card.Link href="/league/view" style={{ color: '#2F2F31' }}>Current Leagues</Card.Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="leagues-item">
                                <Card.Link href="/league/join" style={{ color: '#2F2F31' }}>Join League</Card.Link>
                            </ListGroup.Item>
                            <ListGroup.Item className="leagues-item">
                                <Card.Link href="/league/create" style={{ color: '#2F2F31' }}>Create League</Card.Link>
                            </ListGroup.Item>
                        </ListGroup>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
            <Card.Header className="card-header" style={{ backgroundColor: 'white' }}>
                <Card.Link href="/lookup" style={{ color: '#2F2F31' }}>Symbol Lookup</Card.Link>
            </Card.Header>
            <Card.Header className="card-header" style={{ backgroundColor: 'white' }}>
                <Card.Link href="/news" style={{ color: '#2F2F31' }}>News</Card.Link>
            </Card.Header>
            <Card.Header className="card-header" style={{ backgroundColor: 'white' }}>
                <Card.Link href="/summary" style={{ color: '#2F2F31' }}>Summary</Card.Link>
            </Card.Header>
        </Accordion>
    );
}

export default NavigationBar;
