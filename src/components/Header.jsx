import React, { useContext } from "react";
import PlayerContext from "../PlayerContext";

import { Container, Button } from 'react-bootstrap';

import { BsTranslate } from "react-icons/bs";

export default function Header() {
  const { state, tr, language, setLanguage } = useContext(PlayerContext);

  function onTranslateClick() {
    if (language === "en") {
      setLanguage("uk");
    } else {
      setLanguage("en");
    }
  }

  return (
    <Container fluid className="d-flex align-items-center justify-content-between p-2 bg-primary text-white">
      <div>{state.name ? `${tr("you")}: ${state.name}` : ""}</div>
      <Button variant="outline-light" onClick={onTranslateClick}>
        <BsTranslate size={30} />
      </Button>
    </Container>
  );
};
