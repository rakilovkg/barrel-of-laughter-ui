import React, { useContext, useEffect, useState } from "react";
import { BsPerson, BsList } from "react-icons/bs";
import { Button, Card, Container, Row, Col, Table } from "react-bootstrap";
import useRequest from "../useRequest";
import PlayerContext from "../PlayerContext";

export default function GamePage() {
  const { state, setState, tr } = useContext(PlayerContext);
  const [showPlayers, setShowPlayers] = useState(false);

  const selectCardRequest = useRequest();

  const onToggleButtonClicked = () => {
    setShowPlayers(prev => !prev);
  };

  const onCardSelected = async (cardId) => {
    const newState = await selectCardRequest.send(
      "/game/select-card",
      "POST",
      { cardId }
    );

    if (newState) {
      setState(prev => ({ ...prev, ...newState }));
    }
  };

  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env.API_HOST}/game/events?lobbyId=${state.lobby.id}`,
      { withCredentials: true }
    );

    eventSource.onmessage = (message) => {
      const data = JSON.parse(message.data);

      switch (data.type) {
        case "game_state_updated":
          setState(prev => ({ ...prev, ...data.state }));
          break;

        case "player_disconnected":
          setState(prev => ({
            ...prev,
            game: { ...prev.game, players: data.players }
          }));
          break;

        case "game_finished":
          setState(prev => ({ ...prev, location: "results" }));
          break;

        default:
          break;
      }
    };

    return () => eventSource.close();
  }, []);

  return (
    <Container fluid className="game text-white p-3">
        <h1>GAMW!!</h1>
      <Row className="g-3">
        {/* Game Board */}
        <Col
          xs={12}
          md={8}
          className={`${showPlayers ? "d-none d-md-block" : "d-block"}`}
        >
          {/* Template Card */}
          <Card bg="dark" text="white" className="shadow mb-3">
            <Card.Body>
              <Card.Title>{tr("template_card")}</Card.Title>
              <Card className="bg-secondary text-white p-3 mt-2">
                {}
              </Card>
            </Card.Body>
          </Card>

          {/* Selected Cards */}
          <Card bg="dark" text="white" className="shadow mb-3">
            <Card.Body>
              <Card.Title>{tr("selected_cards")}</Card.Title>
              <Row className="g-2 mt-2">
                {state.game.selectedCards?.map((card, index) => (
                  <Col xs={12} sm={6} key={index}>
                    <Card className="bg-light text-dark p-2">
                      {card.text}
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>

          {/* Available Cards */}
          <Card bg="dark" text="white" className="shadow">
            <Card.Body>
              <Card.Title>{tr("your_cards")}</Card.Title>

              <Row className="g-2 mt-2">
                {state.game.availableCards?.map(card => (
                  <Col xs={12} sm={6} key={card.id}>
                    <Card
                      className="bg-white text-dark p-2 selectable-card"
                      style={{ cursor: "pointer" }}
                      onClick={() => onCardSelected(card.id)}
                    >
                      {card.text}
                    </Card>
                  </Col>
                ))}
              </Row>

              {selectCardRequest.error && (
                <p className="text-danger mt-2">
                  {selectCardRequest.error.message}
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Players & Scores */}
        <Col
          xs={12}
          md={4}
          className={`${showPlayers ? "d-block" : "d-none d-md-block"}`}
        >
          <Card bg="dark" text="white" className="shadow h-100">
            <Card.Body>
              <Card.Title>{tr("players")}</Card.Title>

              <Table variant="dark" hover responsive>
                <tbody>
                  {state.game.players?.map(player => (
                    <tr key={player.name}>
                      <td width="40">
                        <BsPerson size={20} />
                      </td>
                      <td>{player.name}</td>
                      <td className="text-end">
                        <strong>{player.score}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Mobile toggle */}
              <Button
                variant="outline-light"
                className="d-md-none mt-2"
                onClick={onToggleButtonClicked}
              >
                <BsList className="me-2" />
                {tr("view_game")}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Mobile Toggle Button (Board View) */}
      <div className="d-md-none mt-3">
        {!showPlayers && (
          <Button
            variant="outline-light"
            className="w-100"
            onClick={onToggleButtonClicked}
          >
            <BsList className="me-2" />
            {tr("view_players")}
          </Button>
        )}
      </div>
    </Container>
  );
}
