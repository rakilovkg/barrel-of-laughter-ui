import React from "react";

import { Container, Card, Button } from "react-bootstrap";

const GameOver = () => {
    const winners = ["John Smith"];
    return (
        <Container className="d-flex justify-content-center">
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>Game Over</Card.Title>
                    <Card.Text>
                        {
                          winners.length == 1 ?
                            `The winner is ${winners[0]}.` :
                            `The winners are: ${winners.join(", ")}`
                        }
                    </Card.Text>
                    <Button variant="primary" className="me-3">Play Again</Button>
                    <Button variant="danger">Back To Lobby</Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default GameOver;