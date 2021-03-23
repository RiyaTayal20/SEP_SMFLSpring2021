import React from 'react';
import { Redirect } from 'react-router-dom';

function Home() {
    if (!localStorage.getItem('token')) {
        return <Redirect to="/user/login" />;
    }
    // Pass this token into auth header when making requests
    // const token = localStorage.getItem('token');
    // console.log(token);

    return (
        <div>Placeholder</div>
    );
}
export default Home;
