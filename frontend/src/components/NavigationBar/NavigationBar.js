import React from 'react';
import '../../styles/NavigationBar/NavigationBar.scss';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Icon from '../../icons/dropdown-arrow.png';

function NavigationBar() {
    return (
        <Accordion className="sidebar" style={{ border: '4px' }}>
            <Card.Header class="card-header" style={{ backgroundColor: 'white' }}>
                <Card.Link className="card-link" href="#" style={{ color: '#2F2F31' }}>Home</Card.Link>
            </Card.Header>
            <Card.Header class="card-header" style={{ backgroundColor: 'white' }}>
                <Card.Link href="#" style={{ color: '#2F2F31' }}>Portfolio</Card.Link>
            </Card.Header>
            <Card.Header class="card-header" style={{ backgroundColor: 'white' }}>
                <Card.Link href="#" style={{ color: '#2F2F31' }}>Trade</Card.Link>
            </Card.Header>
            <Card.Header class="card-header" style={{ backgroundColor: 'white' }}>
                <Accordion.Toggle
                    as={Card.Header}
                    eventKey=""
                    className="leagues-card"
                    style={{
                        backgroundColor: 'white',
                        border: 'none',
                        padding: '0rem',
                        color: 'black',
                    }}
                >
                    Leagues
                </Accordion.Toggle>
                <div className="arrow">
                    <img src={Icon} alt="dropdown-arrow" className="dropdown-icon" style={{ height: '10px', width: '10px' }} />
                </div>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
                <ListGroup>
                    <ListGroup.Item className="leagues-item">
                        <Card.Link href="#" style={{ marginLeft: '20px', color: '#2F2F31' }}>Current Leagues</Card.Link>
                    </ListGroup.Item>
                    <ListGroup.Item className="leagues-item">
                        <Card.Link href="#" style={{ marginLeft: '20px', color: '#2F2F31' }}>Join Leagues</Card.Link>
                    </ListGroup.Item>
                    <ListGroup.Item className="leagues-item">
                        <Card.Link href="#" style={{ marginLeft: '20px', color: '#2F2F31' }}>Create Leagues</Card.Link>
                    </ListGroup.Item>
                    <ListGroup.Item className="leagues-item">
                        <Card.Link href="#" style={{ marginLeft: '20px', color: '#2F2F31' }}>Transaction History</Card.Link>
                    </ListGroup.Item>
                </ListGroup>
            </Accordion.Collapse>
            <Card.Header class="card-header" style={{ backgroundColor: 'white' }}>
                <Card.Link href="#" style={{ color: '#2F2F31' }}>Symbol Lookup</Card.Link>
            </Card.Header>
            <Card.Header class="card-header" style={{ backgroundColor: 'white' }}>
                <Card.Link href="#" style={{ color: '#2F2F31' }}>News</Card.Link>
            </Card.Header>
            <Card.Header class="card-header" style={{ backgroundColor: 'white' }}>
                <Card.Link href="#" style={{ color: '#2F2F31' }}>Settings</Card.Link>
            </Card.Header>
        </Accordion>
    );
}

export default NavigationBar;
