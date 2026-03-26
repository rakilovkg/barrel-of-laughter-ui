import React from "react";

import { Container, Card, Button } from "react-bootstrap";

import useRequest from "../useRequest";

const GameOver = ({ winners, tr }) => {
    const playAgainRequest = useRequest();
    const backToLobbyRequest = useRequest();

    return (
        <Container className="d-flex justify-content-center">
            <Card style={{ width: '22rem' }}>
                <Card.Body>
                    <Card.Title>{tr("game_over")}</Card.Title>
                    <Card.Text>
                        {
                          winners.length == 1 ?
                            `${tr("winner")} ${winners[0]}.` :
                            `${tr("winners")} ${winners.join(", ")}.`
                        }
                    </Card.Text>
                    <Button variant="primary" className="me-3">{tr("play_again")}</Button>
                    <Button variant="danger">{tr("back_to_lobby")}</Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default GameOver;