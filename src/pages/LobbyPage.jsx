import React, { useContext, useEffect, useState } from "react";
import { BsPerson, BsList } from "react-icons/bs";
import { Button, Card, Container, Row, Col, Table } from "react-bootstrap";
import useRequest from "../useRequest";

import PlayerContext from "../PlayerContext";

export default function LobbyPage() {
  const { setState, state, tr } = useContext(PlayerContext);
  const [showPlayers, setShowPlayers] = useState(false);
  const disconnectRequest = useRequest();

  const onToggleButtonClicked = () => {
    setShowPlayers(prev => !prev);
  };

  useEffect(() => {
    const eventSource = new EventSource(`${process.env.API_HOST}/lobby/events?lobbyId=${state.lobby.id}`);
    
    eventSource.onmessage = (message) =>  {
      const data = JSON.parse(message.data);
      if (data.type == "player_disconnected") {
        setState(prev => ({ ...prev, lobby: { ...state.lobby, players: data.players, }}));
      } else if (data.type == "author_disconnected") {
        setState(prev => ({ ...prev, location: "join" }));
      }
    };
    
  }, []);

  const handleDisconnectClick = async (event) => {
    const newState = await disconnectRequest.send("/lobby/disconnect", "POST");
    setState(prev => ({ ...prev, ...newState }));
  };

  console.log(`State: ${JSON.stringify(state, null, 2)}`);

  return (
    <Container fluid className="lobby text-white p-3">
      {/* Disconnect button */}
      <Button variant="danger" onClick={handleDisconnectClick} className="mb-4">Disconnect</Button>

      <Row className="g-3">
        {/* Lobby Info */}
        <Col
          xs={12}
          md={6}
          className={`${showPlayers ? "d-none d-md-block" : "d-block"}`}
        >
          <Card bg="dark" text="white" className="h-100 shadow">
            <Card.Body>
              <Card.Title>{tr("lobby_info")}</Card.Title>

              <div className="mb-2">
                <strong>ID</strong>
                <input
                  className="form-control mt-1"
                  type="text"
                  disabled
                  value={state.lobby.id}
                />
              </div>

              <div className="mb-2">
                <strong>{tr("password")}</strong>
                <input
                  className="form-control mt-1"
                  type="text"
                  disabled
                  value={state.lobby.password}
                />
              </div>

              <p className="mt-3">
                {tr("connected_players")} {state.lobby.players.length + 1} / 10
              </p>

              {/* Mobile toggle */}
              <Button
                variant="outline-light"
                className="d-md-none mt-2"
                onClick={onToggleButtonClicked}
              >
                <BsList className="me-2" />
                {tr("view_players")}
              </Button>

              {
                state.lobby.authorName == state.name && 
                (<Button variant="primary" className="mt-3 w-100">{tr("start")}</Button>)
              }
            </Card.Body>
          </Card>
        </Col>

        {/* Players */}
        <Col
          xs={12}
          md={6}
          className={`${showPlayers ? "d-block" : "d-none d-md-block"}`}
        >
          <Card bg="dark" text="white" className="h-100 shadow">
            <Card.Body>
              <Card.Title>{tr("players")}</Card.Title>

              <Table variant="dark" hover responsive>
                <tbody>
                  <tr>
                    <td width="50">
                      <BsPerson size={24} />
                    </td>
                    <td>
                      {state.lobby.authorName + " (Host)"}
                    </td>
                  </tr>
                  {
                    state.lobby.players.map(
                      player =>
                        <tr>
                          <td><BsPerson size={24} /></td>
                          <td>{player}</td>
                        </tr>
                    )
                  }
                </tbody>
              </Table>

              {/* Mobile toggle */}
              <Button
                variant="outline-light"
                className="d-md-none mt-2"
                onClick={onToggleButtonClicked}
              >
                <BsList className="me-2" />
                {tr("view_lobby_info")}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
