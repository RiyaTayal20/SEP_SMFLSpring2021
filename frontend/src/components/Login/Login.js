import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import '../../styles/Login/Login.scss';
import { useHistory } from 'react-router-dom';

require('dotenv').config();

function Login() {
    const history = useHistory();
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    const registerAccount = () => {
        history.push('/user/register');
    };

    const login = () => {
        fetch(`${process.env.REACT_APP_API_URL}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: loginUsername,
                password: loginPassword,
            }),
        }).then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    console.log(data.token);
                    localStorage.setItem('token', data.token);
                });
                history.push('/home');
            } else {
                setShowError(true);
                res.text().then((text) => {
                    console.log(text);
                    setError(text);
                });
            }
        }).catch((err) => console.log(err));
    };

    return (
        <Form className="login-form">
            {showError
                && (
                    <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                        <Alert.Heading>Alert</Alert.Heading>
                        <ol><li>{error}</li></ol>
                    </Alert>
                )}
            <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="username" placeholder="Enter username" onChange={(e) => setLoginUsername(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={(e) => setLoginPassword(e.target.value)} />
                <Form.Text className="text-register" onClick={registerAccount}>
                    {" Don't have an account? Register here. "}
                </Form.Text>
            </Form.Group>

            <Button onClick={login}>
                Submit
            </Button>
        </Form>
    );
}

export default Login;
