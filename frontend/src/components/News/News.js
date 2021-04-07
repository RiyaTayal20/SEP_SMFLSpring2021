import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

function News() {
    
    const getNews = async () => {
        const response = await 
    };

    return (
        <Container className="news-container">
            <Card>
                <Card.Body>
                    <Card.Title>News Headline</Card.Title>
                    <Card.Text>
                        News Description
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default JoinLeague;