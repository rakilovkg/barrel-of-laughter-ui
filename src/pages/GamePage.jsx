import React, { useContext, useState, useRef, useEffect } from "react";
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
import useRequest from "../useRequest";

export default function GamePage({ state, setState, tr }) {
  const [activeTab, setActiveTab] = useState("your");
  const [showScores, setShowScores] = useState(false);

  const selectCardRequest = useRequest();

  let socketRef = useRef(null);
  const onCardSelected = async (cardIndex) => {
    if (socketRef.current?.readyState == WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "select_card", index: cardIndex }));
    }
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return String(minutes).padStart(2, '0') + ':' + String(remainingSeconds).padStart(2, '0');
  }

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${protocol}://${process.env.WS_HOST}`);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WS connected");
    };

    ws.onmessage = (message) => {
      console.log("Message:", message.data);
    };

    ws.onerror = (err) => {
      console.error("WS error:", err);
    };

    ws.onclose = () => {
      console.log("WS closed");
    };

    // Countdown
    const onSecondPassed = () => {
      if (state.lobby.timeRemaining > 0) {
        setState(prev => ({ ...prev, lobby: { ...prev.lobby, timeRemaining: prev.lobby.timeRemaining - 1 } }));
        setTimeout(onSecondPassed, 1000);
      }
    };
    setTimeout(onSecondPassed, 1000);

    return () => {
      ws.close(); // cleanup on unmount
    };
  }, []);

  return (
    <Container fluid className="game text-white h-100 d-flex flex-column">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <strong>Round #1 - Draft</strong>
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
      <Row className="flex-grow-1/2">

        {/* Phrase */}
        <Col xs={12} md={2}>
          <Card className="template-card bg-light text-dark h-100">
            <Card.Body>
              {tr(state.lobby.currentPhrase)}
            </Card.Body>
          </Card>
        </Col>

        {/* Desktop Selected Cards */}
        <Col md={7} className="d-none d-md-block">
          <Row className="row-cols-5 h-100">
            {state.lobby.selectedCards.map(card => (
              <Col key={card} className="h-50">
                <Card className="h-100">
                  <Card.Body>{tr(card)}</Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        {/* Desktop Score Panel */}
        <Col md={3} className="flex-fill min-h-0">
          <ScorePanel players={state.lobby.players} tr={tr} />
        </Col>
      </Row>

      {/* Desktop Available Cards */}
      <Row className="d-none d-md-flex flex-fill min-h-0">
        <Col md={{ span: 7, offset: 2 }}>
          <Card className="bg-dark">
            <Card.Body>
              <Row className="row-cols-5">
                {state.lobby.availableCards.map((card, i) => (
                  <Col key={card}>
                    <Card onClick={() => onCardSelected(i)}>
                      <Card.Body>{tr(card)}</Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* MOBILE BOTTOM TABS */}
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
                {state.lobby.selectedCards.map(card => (
                  <Col key={card}>
                    <Card>
                      <Card.Body>{tr(card)}</Card.Body>
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
                    <Card onClick={() => onCardSelected(card)}>
                      <Card.Body>{tr("card")}</Card.Body>
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
          <ScorePanel players={state.lobby.players} tr={tr} />
        </Offcanvas.Body>
      </Offcanvas>

    </Container>
  );
}

function ScorePanel({ players, tr }) {
  return (
    <Card className="h-100 bg-dark">
      <Card.Body>
        <Card.Title>{tr("players")}</Card.Title>
        <Table responsive>
          <tbody>
            {Object.entries(players).map(([playerName, playerData]) => (
              <tr key={playerName} className="text-light">
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
