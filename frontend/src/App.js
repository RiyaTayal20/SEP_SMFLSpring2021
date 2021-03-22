import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {
    RegistrationPage,
    LoginPage,
    HomePage,
    TradePage,
} from './components/Pages';
import Header from './components/Header/Header';
import NavigationBar from './components/NavigationBar/NavigationBar';
import './styles/global.scss';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <Switch>
                    <Route path="/user/register">
                        <RegistrationPage />
                    </Route>
                    <Route path="/user/login">
                        <LoginPage />
                    </Route>
                    <NavigationBar />
                    <Route path="/home">
                        <HomePage />
                    </Route>
                    <Route path="/trade">
                        <TradePage />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
