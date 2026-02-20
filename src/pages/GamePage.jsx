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
    { text: "Stinky socks", id: 0, },
    { text: "Data science", id: 1, },
    { text: "Explosive toilet", id: 2, },
    { text: "Zombie with crowbar leg", id: 3, },
    { text: "A", id: 4, },

    
    { text: "B", id: 5, },
    { text: "C", id: 6, },
    { text: "D", id: 7, },
    
  ];

  const availableCards = [
    { text: "Weird IT guy", id: 0, },
    { text: "Island of doom", id: 1, },
    { text: "BOMB!", id: 2, },
    { text: "WOWOW", id: 3, },
    { text: "XXX", id: 4, },

    { text: "WOWOW", id: 5, },
    { text: "XXX", id: 6, },
  ];

  const players = [
    { name: "Ben (Author)", score: 0 },
    { name: "John (Host)", score: 0 },
    { name: "Daniel", score: 0 },
    { name: "Clark", score: 0 },
  ];

  return (
    <Container fluid className="game text-white h-100 d-flex flex-column g-2">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <strong>Round #1 - Draft</strong>
        </div>
        <div className="d-flex align-items-center gap-2">
          <BsClock />
          <Badge bg="danger">00:42</Badge>
        </div>
      </div>
      <Row>
        <Col xs={12} md={2} className="h-100">
          <Card className="template-card bg-light text-dark d-flex align-items-start justify-content-start h-100">
            <Card.Body>
              The school trip was ruined by ____.
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={7} className="">
          <Row className="row-cols-5 h-100">
            {selectedCards.map((card, index) => (
              <Col key={index} className="h-50">
                <Card className="h-100">
                  <Card.Body>
                    {card.text}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        <Col md={3} className="d-none d-md-block bg-dark text-light">
          <ScorePanel players={players} tr={tr} />
        </Col>
      </Row>

      <Row className="mt-4 h-100">
        <Col xs={12} md={{ span: 7, offset: 2 }}>
          <Card className="h-100 bg-dark">
            <Card.Body>
              <Row className="row-cols-5 h-50">
                {availableCards.map(card => (
                  <Col key={card.id} className="d-flex h-100">
                    <Card
                      onClick={() => onCardSelected(card.id)}
                      className="flex-grow-1 h-100"
                    >
                      <Card.Body>
                        {card.text}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

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
