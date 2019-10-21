import React from 'react';
import './App.css';
import Grid from './Grid';

// function generateBoard(difficulty) {
//   s
// }

function App() {
  return (
    <div className="App">
      <h1>Minesweeper</h1>
      <Grid row={7} col={7} />
    </div>
  );
}

export default App;
