import React from "react";

import { Card, Button } from "react-bootstrap";

import useRequest from "../useRequest";

const GameOver = ({ winners, tr }) => {
  const playAgainRequest = useRequest();
  const backToLobbyRequest = useRequest();

  const onPlayAgainButtonClicked = async () => {
    await playAgainRequest.send("/lobby/play-again", "POST");
  };

  const onBackToLobbyButtonClicked = async () => {
    await backToLobbyRequest.send("/lobby/back-to-lobby", "POST");
  };

  return (
    <Card style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: '22rem',
      zIndex: "1",
    }}>
      <Card.Body>
        <Card.Title>{tr("game_over")}</Card.Title>
        <Card.Text>
          {
            winners.length == 1 ?
              `${tr("winner")} ${winners[0]}.` :
              `${tr("winners")} ${winners.join(", ")}.`
          }
        </Card.Text>
        <Button onClick={onPlayAgainButtonClicked} variant="primary" className="me-3">{tr("play_again")}</Button>
        <Button onClick={onBackToLobbyButtonClicked} variant="danger">{tr("back_to_lobby")}</Button>
      </Card.Body>
    </Card>
  );
};

export default GameOver;