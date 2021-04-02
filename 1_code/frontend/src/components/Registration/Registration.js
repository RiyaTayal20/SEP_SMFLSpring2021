import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import '../../styles/Registration/Registration.scss';
import { useHistory } from 'react-router-dom';

function Register() {
    const history = useHistory();
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [errors, setErrors] = useState([]);

    const loginAccount = () => {
        history.push('/user/login');
    };

    const register = () => {
        fetch(`${process.env.REACT_APP_LAPI_URL}/user/register`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: registerUsername,
                email: registerEmail,
                password: registerPassword,
            }),
        }).then((res) => {
            if (res.ok) {
                res.json();
                history.push('/user/login');
            } else {
                setShowError(true);
                res.json().then((data) => {
                    console.log(data.errors);
                    setErrors(data.errors);
                });
            }
        }).catch((err) => console.log(err));
    };

    return (
        <div className="registration-container">
            <div>
                <div className="registration-form-title">Create your free account here!</div>
            </div>
            <Container>
                <Form className="registration-form">
                    {showError
                    && (
                        <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                            <Alert.Heading>Alert</Alert.Heading>
                            <ol>{errors.map((error) => <li>{error.msg}</li>)}</ol>
                        </Alert>
                    )}
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label required>Username:</Form.Label>
                        <Form.Control type="username" placeholder="Enter username" onChange={(e) => setRegisterUsername(e.target.value)} />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label required>Email Address:</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={(e) => setRegisterEmail(e.target.value)} />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label required>Password:</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={(e) => setRegisterPassword(e.target.value)} />
                        <Form.Text className="text-login" onClick={loginAccount}>
                            Already have an account? Login here.
                        </Form.Text>
                    </Form.Group>

                    <Button onClick={register}>
                        Submit
                    </Button>
                </Form>
            </Container>
        </div>
    );
}

export default Register;
