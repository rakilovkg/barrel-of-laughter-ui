import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Table,
  Tabs,
  Tab,
  Offcanvas,
  Badge
} from "react-bootstrap";
import { BsPersonFill, BsList, BsClock } from "react-icons/bs";

import GameOver from "../components/GameOver";

export default function GamePage({ state, setState, tr }) {
  const [activeTab, setActiveTab] = useState("your");
  const [showScores, setShowScores] = useState(false);

  let socketRef = useRef(null);
  const onAvailableCardClicked = (cardIndex) => {
    if (state.lobby.state == "draft" && state.lobby.currentHost !== state.name) {
      socketRef.current.send(JSON.stringify({ type: "player_selected_card", cardIndex }));
    }
  };

  const onSelectedCardClicked = (cardIndex) => {
    if (state.lobby.state == "judging" && state.lobby.currentHost === state.name) {
      socketRef.current.send(JSON.stringify({ type: "winning_card_selected", cardIndex }));
    }
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return String(minutes).padStart(2, '0') + ':' + String(remainingSeconds).padStart(2, '0');
  }

  let timerIdRef = useRef(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${protocol}://${process.env.WS_HOST}`);
    socketRef.current = ws;

    // Countdown
    const onSecondPassed = () => {
      setState(prev => {
        if (prev.lobby.timeRemaining <= 0) {
          if (timerIdRef.current) {
            clearTimeout(timerIdRef.current);
          }
          return prev;
        }

        timerIdRef.current = setTimeout(onSecondPassed, 1000);

        return {
          ...prev,
          lobby: {
            ...prev.lobby,
            timeRemaining: prev.lobby.timeRemaining - 1
          }
        };
      });
    };

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);

      setState(prev => ({ ...prev, lobby: { ...prev.lobby, ...data.lobby } }));

      if (data.lobby.timeRemaining) {
        clearTimeout(timerIdRef.current);
        timerIdRef.current = setTimeout(onSecondPassed, 1000);
      }
    };

    return () => {
      ws.close();
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    };
  }, []);

  const capitalize = (string) => string[0].toUpperCase() + string.slice(1);

  return (
    <Container fluid className="game text-white d-flex flex-column h-100">

      {
        state.lobby.state === "game_over" &&
        <GameOver winners={state.lobby.winners} tr={tr} />
      }

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <strong>Round #{state.lobby.round} - {capitalize(state.lobby.state)}, Host: {state.lobby.currentHost}</strong>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <BsClock />
            <Badge bg="danger">{formatTime(state.lobby.timeRemaining)}</Badge>
          </div>

          {/* Mobile Players Button */}
          <Button
            variant="outline-light"
            className="d-md-none"
            onClick={() => setShowScores(true)}
          >
            <BsList />
          </Button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <Row className="flex-grow-1">
        {/* Phrase */}
        <Col sm={2} md={2}>
          <Card className="template-card bg-light text-dark">
            <Card.Body>
              {tr(state.lobby.currentPhrase)}
            </Card.Body>
          </Card>
        </Col>

        {/* Selected And Available Cards */}
        <Col
          md={7}
          className="d-none d-md-flex flex-column h-100"
        >

          <div className="card-grid">
            {state.lobby.selectedCards.map((card) => (
                <Card key={card} className="flex-fill d-flex">
                  <Card.Body className="small d-flex align-items-center justify-content-center text-center">
                    {tr(card)}
                  </Card.Body>
                </Card>
            ))}
          </div>

          <div className="card-grid rounded p-2" style={{ outline: "2px solid white" }}>
            {state.lobby.availableCards.map((card) => (
                <Card key={card} className="flex-fill d-flex">
                  <Card.Body className="small d-flex align-items-center justify-content-center text-center">
                    {tr(card)}
                  </Card.Body>
                </Card>
            ))}
          </div>

        </Col>

        {/* Desktop Score Panel */}
        <Col md={3}>
          <ScorePanel players={state.lobby.players} tr={tr} winnerName={state.lobby.winnerName} />
        </Col>
      </Row>

      {/* Mobile Bottom Tabs */}

      <div className="d-md-none position-fixed bottom-0 start-0 end-0 bg-dark border-top">
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-0"
          fill
        >
          <Tab eventKey="your" title="Selected">
            <div className="p-2">
              <Row className="row-cols-2 g-2">
                {state.lobby.selectedCards.map((card, i) => (
                  <Col key={card}>
                    <Card
                      className={`${state.lobby.winningCardIndex === i ? "outline-success" : ""}`}
                      onClick={() => onSelectedCardClicked(i)}
                    >
                      <Card.Body className="small">{tr(card)}</Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Tab>

          <Tab eventKey="available" title="Available">
            <div className="p-2">
              <Row className="row-cols-2 g-2">
                {state.lobby.availableCards.map(card => (
                  <Col key={card}>
                    <Card onClick={() => onAvailableCardClicked(card)}>
                      <Card.Body className="small">{tr(card)}</Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Tab>
        </Tabs>
      </div>

      {/* MOBILE PLAYERS OFFCANVAS */}
      <Offcanvas
        show={showScores}
        onHide={() => setShowScores(false)}
        placement="end"
        className="bg-dark text-white"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>{tr("players")}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ScorePanel players={state.lobby.players} tr={tr} winnerName={state.lobby.winnerName} />
        </Offcanvas.Body>
      </Offcanvas>

    </Container>
  );
}

function ScorePanel({ players, tr, winnerName }) {
  return (
    <Card className="d-none d-md-flex w-100 bg-dark d-flex flex-fill">
      <Card.Body>
        <Card.Title>{tr("players")}</Card.Title>
        <Table responsive>
          <tbody>
            {Object.entries(players).map(([playerName, playerData]) => (
              <tr key={playerName} className={`text-light ${(winnerName == playerName ? "outline-success" : "")}`}>
                <td width="40" className="bg-dark">
                  <BsPersonFill className="text-white" />
                </td>
                <td className="bg-dark text-light">{playerName}</td>
                <td className="text-end fw-bold bg-dark text-light">
                  {playerData.score}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
