import React from 'react';
import './App.css';
import Grid from './Grid';

import { reducer, initialState } from './reducer'
import { useImmerReducer } from 'use-immer';

function App() {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  function handleClick(row, col, value) {
    // do async stuff...
    dispatch({
      type: 'CLICK_TARGET',
      value,
      row,
      col,
    })
  }

  function handleNewGameClick() {
    dispatch({
      type: 'START_NEW_GAME'
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
          Cells left to discover {state.unvisitedCount}
          <Grid grid={state.grid} onClick={handleClick} />
        </>
        )
      }
    </div>
  );
}

export default App;
