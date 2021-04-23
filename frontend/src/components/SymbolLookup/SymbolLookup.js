import React, { useState } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import '../../styles/SymbolLookup/SymbolLookup.scss';
import { useHistory } from 'react-router-dom';
import { Search } from 'react-bootstrap-icons';

function SymbolLookup() {
    const history = useHistory();
    const [ticker, setTicker] = useState('');
    const [showError, setShowError] = useState(false);

    const search = () => {
        if (!ticker) {
            setShowError(true);
        } else {
            history.push('/stock', { tickerSymbol: ticker });
        }
    };
    return (
        <Container className="symbol-lookup-page">
            <h1 className="symbol-text">SYMBOL LOOKUP</h1>
            { showError && (
                <Alert variant="danger" onClose={() => setShowError(false)} dismissible>Invalid Ticker!</Alert>
            )}
            <InputGroup className="symbol-search">
                <FormControl placeholder="Enter ticker symbol" onChange={(e) => setTicker(e.target.value)} />
                <InputGroup.Append>
                    <Button className="search-button" onClick={search}>
                        <Search />
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Container>
    );
}

export default SymbolLookup;
