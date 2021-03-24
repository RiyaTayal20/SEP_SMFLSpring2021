import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import '../../styles/StockLookup/IndividualStock.scss';
// import { useHistory } from 'react-router-dom';

require('dotenv').config();

function IndividualStockPage() {
    // const history = useHistory();
    const [stock, setStock] = useState('');
    // const [loginUsername, setLoginUsername] = useState('');
    // const [loginPassword, setLoginPassword] = useState('');
    // const [state, setState] = useState('');
    // const getData = () => {
    // };
    return (
        <div className="stock-container">
            <Container>
                <Form className="stock-form">
                    <Form.Group controlId="formStock">
                        <Form.Label>Ticker Symbol:</Form.Label>
                        <Form.Control type="text" placeholder="Enter ticker" onChange={(e) => setStock(e.target.value)} />
                    </Form.Group>
                    <h1>{stock}</h1>
                    <Button>
                        Submit
                    </Button>
                </Form>
            </Container>
        </div>
    );
}

export default IndividualStockPage;
