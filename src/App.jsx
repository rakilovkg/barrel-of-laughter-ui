import React, { useState, useEffect } from "react";
import PlayerContext from "./PlayerContext";

import Header from "./components/Header";

import NameInputPage from "./pages/NameInputPage";
import LobbyPage from "./pages/LobbyPage";
import JoinPage from "./pages/JoinPage";

import useTranslate from "./useTranslate";
import useRequest from "./useRequest";

import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [state, setState] = useState({ name: "", location: "" });
  const [tr, language, setLanguage] = useTranslate();
  const playerRequest = useRequest();

  useEffect(() => {
    async function fetchState() {
      const state = await playerRequest.send("/players");
      setState(state);
      console.log(state);
    }
    fetchState();
  }, []);

  let gameContainer;
  switch (state.location) {
    case "input":
      gameContainer = <NameInputPage />;
      break;
    case "join":
      gameContainer = <JoinPage />;
      break;
    case "lobby":
      gameContainer = <LobbyPage />;
      break;
  }

  if (playerRequest.isLoading) {
    gameContainer = <p>Loading...</p>;
  }
  
  if (playerRequest.error) {
    gameContainer = <p>{playerRequest.error}</p>;
  }
  
  return (
    <PlayerContext.Provider value={{ state, setState, tr, language, setLanguage }}>
      <div className="h-100 d-flex flex-column bg-dark">
        <Header />
        <div className="flex-grow-1 p-4">
          { gameContainer }
        </div>
      </div>
    </PlayerContext.Provider>
  );
};