import React from 'react';
import { Redirect, useHistory } from 'react-router-dom';

function Home() {
    const history = useHistory();
    if (!localStorage.getItem('token')) {
        return <Redirect to="/user/login" />;
    }
    // Pass this token into auth header when making requests
    // const token = localStorage.getItem('token');
    // console.log(token);

    // When redirecting, you need to pass data as a state with history.push()
    // and useHistory to access the history as seen below.

    return (
        <div>
            Hello,
            {history.location.state.username}
        </div>
    );
}
export default Home;
