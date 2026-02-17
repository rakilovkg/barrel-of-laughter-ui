import React, { useContext, useState } from "react";
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
import PlayerContext from "../PlayerContext";

export default function GamePage() {
  const { state, setState, tr } = useContext(PlayerContext);
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

  const selectedCards = [
    { text: "Stinky socks" },
    { text: "Data science" },
    { text: "Explosive toilet" },
    { text: "Zombie with crowbar leg" },
  ];

  const players = [
    { name: "Ben (Author)", score: 0 },
    { name: "John (Host)", score: 0 },
    { name: "Daniel", score: 0 },
    { name: "Clark", score: 0 },
  ];

  return (
    <Container fluid className="game text-white p-3">

      {/* TOP BAR */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <strong>Round #1</strong>
        </div>
        <div className="d-flex align-items-center gap-2">
          <BsClock />
          <Badge bg="danger">00:42</Badge>
        </div>
      </div>

      <Row className="g-3">

        {/* LEFT SIDE (Template) */}
        <Col xs={12} md={4}>
          <Card className="template-card shadow-sm">
            <Card.Body>
              <Card.Title>{tr("template_card")}</Card.Title>
              <div className="template-content">
                The school trip was ruined by ____.
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* MAIN AREA */}
        <Col xs={12} md={5}>

          {/* Mobile Tabs */}
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3 d-md-none"
          >
            <Tab eventKey="your" title={tr("your_cards")} />
            <Tab eventKey="selected" title={tr("selected_cards")} />
          </Tabs>

          {/* DESKTOP TITLES */}
          <div className="d-none d-md-block mb-2">
            <h5>
              {activeTab === "your"
                ? tr("your_cards")
                : tr("selected_cards")}
            </h5>
          </div>

          {/* CARDS GRID */}
          <Row className="g-2">

            {/* Your Cards */}
            {(activeTab === "your" || window.innerWidth >= 768) &&
              state.game?.availableCards?.map(card => (
                <Col xs={6} key={card.id}>
                  <Card
                    className="game-card selectable"
                    onClick={() => onCardSelected(card.id)}
                  >
                    {card.text}
                  </Card>
                </Col>
              ))}

            {/* Selected Cards */}
            {(activeTab === "selected") &&
              selectedCards.map((card, index) => (
                <Col xs={6} key={index}>
                  <Card className="game-card selected">
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
        </Col>

        {/* DESKTOP SCORE PANEL */}
        <Col md={3} className="d-none d-md-block">
          <ScorePanel players={players} tr={tr} />
        </Col>
      </Row>

      {/* MOBILE FLOATING BUTTON */}
      <Button
        variant="light"
        className="d-md-none position-fixed bottom-0 end-0 m-3 rounded-circle shadow"
        style={{ width: 56, height: 56 }}
        onClick={() => setShowScores(true)}
      >
        <BsList />
      </Button>

      {/* MOBILE OFFCANVAS SCORES */}
      <Offcanvas
        show={showScores}
        onHide={() => setShowScores(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{tr("players")}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ScorePanel players={players} tr={tr} />
        </Offcanvas.Body>
      </Offcanvas>

    </Container>
  );
}

function ScorePanel({ players, tr }) {
  return (
    <Card className="shadow-sm h-100">
      <Card.Body>
        <Card.Title>{tr("players")}</Card.Title>
        <Table responsive>
          <tbody>
            {players.map(player => (
              <tr key={player.name}>
                <td width="40">
                  <BsPersonFill />
                </td>
                <td>{player.name}</td>
                <td className="text-end fw-bold">
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
