import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import '../../styles/CreateLeague/CreateLeague.scss';

function CreateLeague() {
    // const history = useHistory();
    /* const [leagueName, setLeagueName] = useState('');
    const [balance, setBalance] = useState('');
    const [commission, setCommission] = useState('');
    const [limit, setLimit] = useState('');
    const [visibility, setVisibility] = useState('');
    const [aiPlayers, setAiPlayers] = useState(''); */
    // const [start, setStart] = useState('');
    // const [end, setEnd] = useState('');
    // const [showError, setShowError] = useState(false);
    // const [error, setError] = useState('');

    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };

    return (
        <div>
            <div className="create-league-form-title">
                Create your fantasy league
            </div>
            <Container className="create-league-container">
                <Form className="create-league-form" noValidate validated={validated} onSubmit={handleSubmit}>
                    {/* {showError
                        && (
                            <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                                <Alert.Heading>Alert</Alert.Heading>
                                <ol><li>{error}</li></ol>
                            </Alert>
                        )} */ }
                    <div className="form-content">
                        <Form.Group controlId="formLeagueName">
                            <Row>
                                <Form.Label column>League Name</Form.Label>
                                <Col>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Enter League Name..."
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
                                        <Form.Control type="number" min="0" step="0.01" placeholder="Enter starting balance" required />
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
                                        <Form.Control type="number" min="0" max="100" step="0.01" placeholder="Enter percentage" required />

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
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control type="number" min="0" step="0.01" placeholder="Enter trade limit" required />
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
                                    <Form.Control as="select" defaultValue="Choose...">
                                        <option>Public</option>
                                        <option>Private</option>
                                    </Form.Control>

                                </Col>
                            </Row>
                        </Form.Group>

                        <Form.Group controlId="NumofAIBots">
                            <Row>
                                <Form.Label column> # of AI bots: </Form.Label>
                                <Col>
                                    <Form.Control as="select">
                                        <option value="0">Zero</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </Form.Control>
                                </Col>
                            </Row>
                        </Form.Group>

                        <Form.Group controlId="formStart">
                            <Row>
                                <Form.Label column> Start Date </Form.Label>
                                <Col>

                                    <Form.Control type="date" min="2021-03-21" max="2050-03-21" placeholder="Enter a start date" required />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid start date.
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>
                        </Form.Group>

                        <Form.Group controlId="formEnd">
                            <Row>
                                <Form.Label column> End Date </Form.Label>
                                <Col>

                                    <Form.Control type="date" min="2021-03-22" max="2050-03-21" placeholder="Enter an end date" required />
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
