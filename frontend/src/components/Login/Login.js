import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../../styles/Login/Login.scss';
import { useHistory } from 'react-router-dom';

function Login() {
    const history = useHistory();

    const registerAccount = () => {
        history.push('/register');
    };

    return (
        <Form className="login-form">
            <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="username" placeholder="Enter username" />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
                <Form.Text className="text-register" onClick={registerAccount}>
                    {" Don't have an account? Register here. "}
                </Form.Text>
            </Form.Group>

            <Button>
                Submit
            </Button>
        </Form>
    );
}

export default Login;
