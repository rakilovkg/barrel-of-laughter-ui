import React, { useState, useContext, useRef } from "react";
import { Button, Card, Container, Row, Col, Table } from "react-bootstrap";

import PlayerContext from "../PlayerContext";
import useRequest from "../useRequest";

export default function JoinPage() {
  const { setState, tr } = useContext(PlayerContext);
  const [input, setInput] = useState({ lobbyId: "", lobbyPassword: "" });
  const [inputError, setInputError] = useState("");
  const createLobbyRequest = useRequest();
  const joinLobbyRequest = useRequest();

  const handleOnInputChange = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value, });
  };

  const handleCreateLobbyClick = async () => {
    const newState = await createLobbyRequest.send("/lobby", "POST");
    if (newState) {
      setState(prev => ({ ...prev, ...newState }));
    }
  };

  const timeoutRef = useRef(null);

  const handleJoinLobbyClick = async () => {
    if (!input.lobbyId || !input.lobbyPassword) {
      setInputError(tr("input_error"));

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => setInputError(""), 3000);
      return;
    }

    setInputError("");
    
    const newState = await joinLobbyRequest.send("/lobby/join", "POST", input);
    if (newState.location) {
      setState(prev => ({ ...prev, ...newState }));
    }
  };

  return (
    <Container fluid className="lobby text-white align-center p-3">
      <Row className="g-3 justify-content-center">
        {/* Lobby Info */}
        <Col
          xs={12}
          md={6}
        >
          <Card bg="dark" text="white" className="h-100 shadow">
            <Card.Body>
              <Card.Title>{tr("lobby_info")}</Card.Title>

              <div className="mb-2">
                <strong>ID</strong>
                <input
                  className="form-control mt-1"
                  type="text"
                  name="lobbyId"
                  value={input.lobbyId}
                  onChange={handleOnInputChange}
                />
              </div>

              <div className="mb-2">
                <strong>{tr("password")}</strong>
                <input
                  className="form-control mt-1"
                  type="password"
                  name="lobbyPassword"
                  value={input.lobbyPassword}
                  onChange={handleOnInputChange}
                />
              </div>

              { inputError && <span className="text-danger">{inputError}</span> }
              { joinLobbyRequest.error && <span className="text-danger">{joinLobbyRequest.error.message}</span> }

              <Button variant="success" className="mt-3 mb-3 w-100" onClick={handleJoinLobbyClick}>
                {tr("join")}
              </Button>

              <span className="me-2">{tr("create_lobby")}</span>
              <Button variant="primary" onClick={handleCreateLobbyClick}>{tr("create")}</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
