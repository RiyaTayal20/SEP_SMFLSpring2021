import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function SymbolLookup() {
    const search = () => { };
    return (
        <div>
            <div className="Symbol-lookup-page">
                <h1> SYMBOL LOOKUP </h1>
                <Form>
                    <Form.Group className="Search" controlId="Search">
                        <Form.Control type="Search" placeholder="SEARCH" style={{ border: 'none' }} />
                    </Form.Group>
                </Form>
            </div>
            <div className="Button">
                <Button className="Search-Button" onClick={search}> </Button>
            </div>
        </div>
    );
}

export default SymbolLookup;
