import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Homepage from './views/Homepage';
import Room from './views/Room';
import CreateRoom from './views/CreateRoom';
import Game from './views/Game';
import Problem from './views/Problem';
import Results from './views/Results';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route exact path="/room" element={<Room />} />
        <Route exact path="/createroom" element={<CreateRoom />} />
        <Route exact path="/game" element={<Game />} />
        <Route exact path="/problem" element={<Problem />} />
        <Route exact path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;
