import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../../styles/SymbolLookup/SymbolLookup.scss';
import Icon from '../../icons/magnifier.png';

function SymbolLookup() {
    const search = () => { };
    return (
        <div>
            <div className="Symbol-lookup-page">
                <h1 className="symbol-text" style={{ color: '#5367FC', fontSize: '4rem', fontWeight: 'bold' }}>SYMBOL LOOKUP</h1>
                <Form>
                    <Form.Group className="Search" controlId="Search">
                        <Form.Control type="Search" placeholder="SEARCH" style={{ border: 'none' }} />
                        <Button className="Search-Button" onClick={search}>
                            <img src={Icon} alt="magnifier" className="magnifier" />
                        </Button>
                    </Form.Group>
                </Form>
            </div>
        </div>
    );
}

export default SymbolLookup;
