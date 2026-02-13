import React, { useState, useContext } from "react";
import PlayerContext from "../PlayerContext";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import useRequest from "../useRequest";

export default function NameInputPage() {
  const { tr, setState } = useContext(PlayerContext);
  const [nameInput, setNameInput] = useState("");
  const setNameRequest = useRequest();
  
  const handleSubmit = async () => {
    const state = await setNameRequest.send("/players/set-name", "POST", { name: nameInput });
    if (state) {
      setState(state);
    }
  };

  return (
    <div className="h-50 d-flex flex-column justify-content-center align-items-center">
      <p className="text-white"><b>{tr("welcome")}</b></p>
      <p className="text-white">{tr("name")}</p>
        <InputGroup>
          <Form.Control
            placeholder={tr("name_example")}
            value={nameInput}
            onChange={event => setNameInput(event.target.value)}
          />
          <Button
            variant="outline-secondary"
            onClick={handleSubmit}
            type="submit"
            required
          >
            {tr("submit")}
          </Button>
        </InputGroup>
        <p className="text-danger mt-2">{setNameRequest.error?.message}</p>
      </div>
  );
};
