import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { RegistrationPage, LoginPage, HomePage } from './components/Pages';
import Header from './components/Header/Header';
import './ScssComponents/global.scss';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <Switch>
                    <Route path="/user/register">
                        <Container>
                            <RegistrationPage />
                        </Container>
                    </Route>
                    <Route path="/user/login">
                        <Container>
                            <LoginPage />
                        </Container>
                    </Route>
                    <Route path="/home">
                        <HomePage />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
