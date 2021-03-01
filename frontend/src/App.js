import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import './ScssComponents/global.scss';
import RegistrationPage from './components/Registration';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <Switch>
                    <Route path="/register">
                        <RegistrationPage />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
