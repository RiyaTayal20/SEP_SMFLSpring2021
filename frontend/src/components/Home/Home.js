import React from 'react';
import { Redirect } from 'react-router-dom';

function Home() {
    if (!localStorage.getItem('token')) {
        return <Redirect to="/user/login" />;
    }
    const token = localStorage.getItem('token');
    console.log(token);

    return (
        <div>Placeholder</div>
    );
}
export default Home;
