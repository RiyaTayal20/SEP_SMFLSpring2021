import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

const Articles = (props) => {
    const { articles } = props;

    return (
        <Container className="articles-container">
            {articles.map((article) => (
                <div className="article">
                    <Card className="article-cards">
                        <Card.Img className="article-image-cards" variant="top" src={article.image} />
                        <Card.Body>
                            <Card.Title className="article-headline">{article.headline}</Card.Title>
                            <Card.Text>
                                Source: {article.source}
                            </Card.Text>
                            <Card.Link href={article.url}>Read</Card.Link>
                        </Card.Body>
                    </Card>
                </div>
            ))}
        </Container>
    );
};

export default Articles;
