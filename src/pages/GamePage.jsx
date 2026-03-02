import React, { useContext, useState, useEffect } from "react";
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
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(`${protocol}://${process.env.WS_HOST}`);
  
    socket.onopen = () => {
      console.log("WS connected");
    };
  
    socket.onmessage = (message) => {
      console.log("Message:", message.data);
    };
  
    socket.onerror = (err) => {
      console.error("WS error:", err);
    };
  
    socket.onclose = () => {
      console.log("WS closed");
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
            <Badge bg="danger">00:42</Badge>
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
              {tr(state.lobby.phrase)}
            </Card.Body>
          </Card>
        </Col>
  
        {/* Desktop Selected Cards */}
        <Col md={7} className="d-none d-md-block">
          <Row className="row-cols-5 h-100">
            {state.lobby.selectedCards.map(card => (
              <Col key={card.id} className="h-50">
                <Card className="h-100">
                  <Card.Body>{card.text}</Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
  
        {/* Desktop Score Panel */}
        <Col md={3} className="flex-fill min-h-0">
          <ScorePanel players={Object.keys(state.lobby.players)} tr={tr} />
        </Col>
      </Row>
  
      {/* Desktop Available Cards */}
      <Row className="d-none d-md-flex flex-fill min-h-0">
        <Col md={{ span: 7, offset: 2 }}>
          <Card className="bg-dark">
            <Card.Body>
              <Row className="row-cols-5">
                {state.lobby.availableCards.map(card => (
                  <Col key={card.id}>
                    <Card onClick={() => onCardSelected(card.id)}>
                      <Card.Body>{card.text}</Card.Body>
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
                  <Col key={card.id}>
                    <Card>
                      <Card.Body>{card.text}</Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Tab>
  
          <Tab eventKey="available" title="Available">
            <div className="p-2">
              <Row className="row-cols-2 g-2">
                {state.availableCards.map(card => (
                  <Col key={card.id}>
                    <Card onClick={() => onCardSelected(card.id)}>
                      <Card.Body>{card.text}</Card.Body>
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
          <ScorePanel players={Object.keys(state.lobby.players)} tr={tr} />
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
            {players.map(player => (
              <tr key={player.name} className="text-light">
                <td width="40" className="bg-dark">
                  <BsPersonFill className="text-white" />
                </td>
                <td className="bg-dark text-light">{player.name}</td>
                <td className="text-end fw-bold bg-dark text-light">
                  {player.score}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
