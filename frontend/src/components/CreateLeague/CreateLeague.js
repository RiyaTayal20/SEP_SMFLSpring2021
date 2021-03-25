import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import '../../styles/CreateLeague/CreateLeague.scss';

function CreateLeague() {
    // const history = useHistory();
    const [leagueName, setLeagueName] = useState('');
    const [leagueKey, setLeagueKey] = useState('');
    const [showLeagueKey, setShowLeagueKey] = useState(false);
    const [balance, setBalance] = useState('');
    const [commission, setCommission] = useState('');
    const [limit, setLimit] = useState('');
    const [visibility, setVisibility] = useState(true);
    const [aiPlayers, setAiPlayers] = useState('');
    const [maxPlayers, setMaxPlayers] = useState('');
    const [end, setEnd] = useState('');
    const [showError, setShowError] = useState(false);
    const [errors, setErrors] = useState([]);

    const [validated, setValidated] = useState(false);

    const createLeague = () => {
        fetch(`${process.env.REACT_APP_API_URL}/league/create`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                leagueName,
                leagueKey,
                settings: {
                    balance,
                    aiPlayers,
                    maxPlayers,
                    endDate: end,
                    public: visibility,
                    commissionPercent: commission,
                    tradeLimit: limit,
                },
            }),
        }).then((res) => {
            if (res.ok) {
                console.log('Successfully created league');
                // history.push('some league home page');
            } else {
                setShowError(true);
                res.json().then((data) => {
                    console.log(data.errors);
                    setErrors(data.errors);
                });
            }
        }).catch((err) => console.log(err));
    };

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true);
        createLeague();
    };

    return (
        <div>
            <div className="create-league-form-title">
                Create your fantasy league
            </div>
            <Container className="create-league-container">
                <Form className="create-league-form" noValidate validated={validated} onSubmit={handleSubmit}>
                    {showError
                        && (
                            <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                                <Alert.Heading>Alert</Alert.Heading>
                                <ol>{errors.map((error) => <li>{error.msg}</li>)}</ol>
                            </Alert>
                        )}
                    <div className="form-content">
                        <Form.Group controlId="formLeagueName">
                            <Row>
                                <Form.Label column>League Name</Form.Label>
                                <Col>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Enter League Name..."
                                        onChange={(e) => setLeagueName(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a League Name.
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>
                        </Form.Group>

                        <Form.Group controlId="formBalance">
                            <Row>
                                <Form.Label column> Starting Balance </Form.Label>
                                <Col>
                                    <InputGroup hasValidation>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="Enter starting balance"
                                            required
                                            onChange={(e) => setBalance(e.target.value)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a valid starting value.
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Form.Group>

                        <Form.Group controlId="formCommission">
                            <Row>
                                <Form.Label column> Commission Percentage(%) </Form.Label>
                                <Col>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            placeholder="Enter percentage"
                                            required
                                            onChange={(e) => setCommission(e.target.value)}
                                        />
                                        <InputGroup.Append>
                                            <InputGroup.Text>%</InputGroup.Text>
                                        </InputGroup.Append>
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a valid commission
                                            percentage to 2 decimal places.
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Form.Group>

                        <Form.Group controlId="formLimit">
                            <Row>
                                <Form.Label column> Trade Limit </Form.Label>
                                <Col>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            placeholder="Enter trade limit"
                                            required
                                            onChange={(e) => setLimit(e.target.value)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a valid trade limit to two decimal places
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Form.Group>

                        <Form.Group controlId="formVis">
                            <Row>
                                <Form.Label column> Visibility </Form.Label>
                                <Col>
                                    <Form.Control
                                        as="select"
                                        defaultValue="Choose..."
                                        onChange={(e) => {
                                            setVisibility(e.target.value);
                                            if (e.target.value === 'false') {
                                                setShowLeagueKey(true);
                                            } else {
                                                setShowLeagueKey(false);
                                            }
                                        }}
                                    >
                                        <option value="true">Public</option>
                                        <option value="false">Private</option>
                                    </Form.Control>

                                </Col>
                            </Row>
                        </Form.Group>

                        {showLeagueKey
                        && (
                            <Form.Group controlId="formLeagueKey">
                                <Row>
                                    <Form.Label column>League Key</Form.Label>
                                    <Col>
                                        <Form.Control
                                            required
                                            type="password"
                                            placeholder="Enter League Key..."
                                            onChange={(e) => setLeagueKey(e.target.value)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a League Key.
                                        </Form.Control.Feedback>
                                    </Col>
                                </Row>
                            </Form.Group>
                        )}

                        <Form.Group controlId="NumofAIBots">
                            <Row>
                                <Form.Label column> # of AI bots: </Form.Label>
                                <Col>
                                    <Form.Control as="select" onChange={(e) => setAiPlayers(e.target.value)}>
                                        <option value="0">Zero</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </Form.Control>
                                </Col>
                            </Row>
                        </Form.Group>

                        <Form.Group controlId="formMaxPlayers">
                            <Row>
                                <Form.Label column> Max # of Players </Form.Label>
                                <Col>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            max="12"
                                            placeholder="Enter max players"
                                            required
                                            onChange={(e) => setMaxPlayers(e.target.value)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a number between 1 and 12
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Form.Group>

                        <Form.Group controlId="formEnd">
                            <Row>
                                <Form.Label column> End Date </Form.Label>
                                <Col>

                                    <Form.Control
                                        type="date"
                                        min="2021-03-22"
                                        max="2050-03-21"
                                        placeholder="Enter an end date"
                                        required
                                        onChange={(e) => setEnd(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid end date.
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>
                        </Form.Group>
                    </div>
                    <Button type="submit" size="lg">Create</Button>
                </Form>
            </Container>
        </div>
    );
}

export default CreateLeague;
