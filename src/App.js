import React, { useState } from 'react';
import './App.css';
import Grid from './Grid';
import Game from './game';

function App() {
  const [state, setState] = useState({
    gameInstance: null,
    status: 'new',
    grid: null,
  })

  function handleNewGameClick() {
    const gameInstance = new Game()
    const { grid, status } = gameInstance.start()
    setState({
      gameInstance,
      grid,
      status,
    })
  }

  function handleClick(row, col) {
    const { grid, status } = state.gameInstance.click(Number(row), Number(col))
    setState({
      ...state,
      grid,
      status,
    })
  }

  return (
    <div className="App">
      {
        state.status === 'new' && <button onClick={handleNewGameClick}>New game</button>
      }
      {
        state.status === 'wins' && <h3>Congrats! You won!</h3>
      }
      {
        state.status === 'loses' && <div>
          You hit a mine, try again?
        </div>
      }
      {
        state.status !== 'new' && state.status !== 'playing' && <button onClick={handleNewGameClick}>Replay</button>
      }
      {
        state.status !== 'new' && (<>
          <Grid grid={state.grid} onClick={handleClick} />
        </>
        )
      }
    </div>
  );
}

export default App;
