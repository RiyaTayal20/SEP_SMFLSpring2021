import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../../styles/Registration/Registration.scss';
import { useHistory } from 'react-router-dom';

function Register() {
    const history = useHistory();

    const loginAccount = () => {
        history.push('/login');
    };

    return (
        <Form className="registration-form">
            <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="username" placeholder="Enter username" />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
                <Form.Text className="text-login" onClick={loginAccount}>
                    Already have an account? Login here.
                </Form.Text>
            </Form.Group>

            <Button>
                Submit
            </Button>
        </Form>
    );
}

export default Register;
