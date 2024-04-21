import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './Game';
import PartTwo from './partTwo';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Game />} />  // Set Game as the default component
        <Route path="/partTwo" element={<PartTwo />} />
        <Route path="/game" element={<Game />} />
       
      </Routes>
    </div>
  );
}

export default App;

