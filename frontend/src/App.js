import React from 'react';
import {
    BrowserRouter as Router, Switch, Route,
} from 'react-router-dom';
import {
    RegistrationPage,
    LoginPage,
    HomePage,
    CreateLeaguePage,
    JoinLeaguePage,
    IndividualStockPage,
    TradePage,
    CurrentLeaguesPage,
    SymbolLookupPage,
    PortfolioPage,
} from './components/Pages';
import Header from './components/Header/Header';
import NavigationBar from './components/NavigationBar/NavigationBar';
import './styles/global.scss';

require('dotenv').config();

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <div className="site-container">
                    { ['/user/register', '/user/login'].indexOf(window.location.pathname) < 0 && <NavigationBar /> }
                    <div className="site-content">
                        <Switch>
                            <Route path="/user/register">
                                <RegistrationPage />
                            </Route>
                            <Route path="/user/login">
                                <LoginPage />
                            </Route>
                            <Route path="/home">
                                <HomePage />
                            </Route>
                            <Route path="/league/create">
                                <CreateLeaguePage />
                            </Route>
                            <Route path="/league/join">
                                <JoinLeaguePage />
                            </Route>
                            <Route path="/stock">
                                <IndividualStockPage />
                            </Route>
                            <Route path="/trade">
                                <TradePage />
                            </Route>
                            <Route path="/league/view">
                                <CurrentLeaguesPage />
                            </Route>
                            <Route path="/portfolio">
                                <PortfolioPage />
                            </Route>
                            <Route path="/lookup">
                                <SymbolLookupPage />
                            </Route>
                        </Switch>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;
