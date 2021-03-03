import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../../styles/Registration/Registration.scss';
import { useHistory } from 'react-router-dom';

require('dotenv').config();

function Register() {
    const history = useHistory();
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');

    const loginAccount = () => {
        history.push('/user/login');
    };

    const register = () => {
        fetch(`${process.env.HOST}/user/register`, {
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
        }).then((res) => res.json()).catch((err) => console.log(err));
        history.push('/user/login');
    };

    return (
        <Form className="registration-form">
            <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="username" placeholder="Enter username" onChange={(e) => setRegisterUsername(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={(e) => setRegisterEmail(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={(e) => setRegisterPassword(e.target.value)} />
                <Form.Text className="text-login" onClick={loginAccount}>
                    Already have an account? Login here.
                </Form.Text>
            </Form.Group>

            <Button onClick={register}>
                Submit
            </Button>
        </Form>
    );
}

export default Register;
