import './App.css';

import { HowlOptions } from 'howler';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import useSound from 'use-sound';

import crystalCaveSong from './assets/music/crystal-cave-song.mp3';
import { Game } from './components/Game';
import { MapGenerator } from './components/MapGenerator';
import { useDetectUserInput } from './hooks/useDetectUserInput';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  height: 100%;
  width: 100%;
  font-family: UglyTerminal;
`;

export const App: React.FC = () => {
  const [play, { stop }] = useSound<HowlOptions>(crystalCaveSong, { loop: true, volume: 0.1 });
  const didUserInput = useDetectUserInput();
  const [withBackgroundMusic, setWithBackgroundMusic] = React.useState(false);

  React.useEffect(() => {
    if (didUserInput && withBackgroundMusic) {
      play();
    }
  }, [didUserInput]);

  React.useEffect(() => {
    if (withBackgroundMusic === false) {
      stop();
    } else {
      play();
    }
  }, [withBackgroundMusic]);

  return (
    <Wrapper>
      <Router>
        <Switch>
          <Route exact path="/">
            <Game
              withBackgroundMusic={withBackgroundMusic}
              setWithBackgroundMusic={setWithBackgroundMusic}
            />
          </Route>
          <Route exact path="/pcg">
            <MapGenerator />
          </Route>
        </Switch>
      </Router>
    </Wrapper>
  );
};
