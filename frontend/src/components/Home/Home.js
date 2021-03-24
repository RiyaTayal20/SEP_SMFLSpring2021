import React from 'react';
import '../../styles/Home/Home.scss';
import Form from 'react-bootstrap/Form';
// import { Redirect, useHistory } from 'react-router-dom';
import Icon from '../../icons/user-profile.png';

function Home() {
    // const history = useHistory();
    // if (!localStorage.getItem('token')) {
    //     return <Redirect to="/user/login" />;
    // }
    // Pass this token into auth header when making requests
    // const token = localStorage.getItem('token');

    return (
        <div className="home-page">
            <div className="user-profile-section" style={{ justifyContent: 'center' }}>
                <div className="image-container">
                    <img src={Icon} alt="dropdown-arrow" className="dropdown-icon" style={{ height: '200px', width: '200px' }} />
                </div>
                <Form.Group className="username">
                    <Form.Control
                        className="form"
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '0rem',
                            textAlign: 'center',
                        }}
                        // placeholder={history.location.state.username}
                        disabled
                    />
                </Form.Group>
            </div>
            <div className="league-information">
                <div className="tab-placeholder" style={{ color: 'white' }}>
                    Tabs will go here.
                </div>
                <div className="transaction-placeholder" style={{ color: 'white' }}>
                    League Transaction history will go here
                </div>
            </div>
        </div>
    );
}
export default Home;
