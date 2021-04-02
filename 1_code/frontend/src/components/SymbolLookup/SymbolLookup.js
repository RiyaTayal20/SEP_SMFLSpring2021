import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../../styles/SymbolLookup/SymbolLookup.scss';
import { useHistory } from 'react-router-dom';
import Icon from '../../icons/magnifier-icon.png';

function SymbolLookup() {
    const history = useHistory();
    const [ticker, setTicker] = useState('');

    const search = () => {
        history.push('/stock', { tickerSymbol: ticker });
    };
    return (
        <div className="symbol-lookup-page">
            <h1 className="symbol-text" style={{ color: '#5367FC', fontSize: '4rem', fontWeight: 'bold' }}>SYMBOL LOOKUP</h1>
            <div className="search-container">
                <Form className="search-component">
                    <Form.Group className="search" controlId="Search" style={{ backgroundColor: 'Transparent' }}>
                        <Form.Control type="search" placeholder="SEARCH" style={{ border: '0rem' }} onChange={(e) => setTicker(e.target.value)} />
                    </Form.Group>
                    <Button className="search-button" onClick={search} style={{ backgroundColor: 'Transparent', borderColor: 'Transparent' }}>
                        <div className="image">
                            <img src={Icon} alt="magnifier" className="magnifier" style={{ width: '30px', height: '30px' }} />
                        </div>
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default SymbolLookup;
