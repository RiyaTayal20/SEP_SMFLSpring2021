import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import '../../styles/CreateLeague/CreateLeague.scss';

function CreateLeague() {
    // const history = useHistory();
    const [leagueName, setLeagueName] = useState('');
    const [balance, setBalance] = useState('');
    const [commission, setCommission] = useState('');
    const [limit, setLimit] = useState('');
    const [visibility, setVisibility] = useState('');
    const [aiPlayers, setAiPlayers] = useState('');
    // const [start, setStart] = useState('');
    // const [end, setEnd] = useState('');
    // const [showError, setShowError] = useState(false);
    // const [error, setError] = useState('');

    return (
        <div>
            <div>
                <div className="create-league-form-title">Create your fantasy league</div>
            </div>
            <Form className="create-league-form">
                {/* {showError
                    && (
                        <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                            <Alert.Heading>Alert</Alert.Heading>
                            <ol><li>{error}</li></ol>
                        </Alert>
                    )} */ }
                <Form.Group controlId="formLeagueName">
                    <Row>
                        <Form.Label column>League Name</Form.Label>
                        <Col>
                            <Form.Control type="username" placeholder="Enter name" />
                        </Col>
                    </Row>
                </Form.Group>

                <Form.Group controlId="formBalance">
                    <Row>
                        <Form.Label column> Starting Balance </Form.Label>
                        <Col>
                            <Form.Control type="balance" placeholder="Enter number" />
                        </Col>
                    </Row>
                </Form.Group>

                <Form.Group controlId="formCommission">
                    <Row>
                        <Form.Label column> Commission Percentage(%) </Form.Label>
                        <Col>
                            <Form.Control type="balance" placeholder="Enter number" />
                        </Col>
                    </Row>
                </Form.Group>

                <Form.Group controlId="formLimit">
                    <Row>
                        <Form.Label column> Trade Limit </Form.Label>
                        <Col>
                            <Form.Control type="balance" placeholder="Default is 0" />
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

                <Form.Group controlId="formAI">
                    <Row>
                        <Form.Label column> # of AI Players </Form.Label>
                        <Col>
                            <Form.Control type="balance" placeholder="Default is 0" />
                        </Col>
                    </Row>
                </Form.Group>

                <Form.Group as={Row} controlId="formStart">
    <Form.Label column sm={2}>
      Start Date:
    </Form.Label>

    <Form.Group as={Col} controlId="startMonth">
      <Form.Label>Month</Form.Label>
      <Form.Control as="select" defaultValue="Choose...">
        <option>January</option>
        <option>February</option>
        <option>March</option>
        <option>April</option>
      </Form.Control>
    </Form.Group>

    <Form.Group as={Col} controlId="startDay">
      <Form.Label>Day</Form.Label>
      <Form.Control as="select" defaultValue="Choose...">
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
      </Form.Control>
    </Form.Group>

<Form.Group as={Col} controlId="startYear">
      <Form.Label>Year</Form.Label>
      <Form.Control as="select" defaultValue="Choose...">
        <option>2021</option>
        <option>2022</option>
        <option>2023</option>
        <option>2024</option>
      </Form.Control>
    </Form.Group>
  </Form.Group>


                <Form.Group as={Row} controlId="EndDate">
    <Form.Label column sm={2}>
      End Date:
    </Form.Label>

    <Form.Group as={Col} controlId="endMonth">
      <Form.Label>Month</Form.Label>
      <Form.Control as="select" defaultValue="Choose...">
        <option>January</option>
        <option>February</option>
        <option>March</option>
        <option>April</option>
      </Form.Control>
    </Form.Group>

    <Form.Group as={Col} controlId="endDay">
      <Form.Label>Day</Form.Label>
      <Form.Control as="select" defaultValue="Choose...">
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
      </Form.Control>
    </Form.Group>

<Form.Group as={Col} controlId="endYear">
      <Form.Label>Year</Form.Label>
      <Form.Control as="select" defaultValue="Choose...">
        <option>2021</option>
        <option>2022</option>
        <option>2023</option>
        <option>2024</option>
      </Form.Control>
    </Form.Group>

  </Form.Group>


                <Button>
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default CreateLeague;
