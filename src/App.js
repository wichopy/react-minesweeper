import React, { useEffect } from 'react';
import './App.css';
import Grid from './Grid';

import { useImmerReducer } from 'use-immer';

const initialState = {
  grid: [],
}

function reducer(draft, action) {
  switch (action.type) {
    case 'CLICK_TARGET':
      console.log(action)
      draft.grid[action.row][action.col] = action.value
      break;
    case 'HYDRATE_GRID':
      draft.grid = action.grid
      break;
    default:
      return draft;
  }
}

const set = new Set(['h', 'x', 'b', '1', '2', '3', '4', '5', '6', '7', '8'])

function App() {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    dispatch({
      type: 'HYDRATE_GRID',
      grid: [
        ['h', 'h', 'h', 'h', 'h'],
        ['h', 'h', 'h', 'h', 'h'],
        ['h', 'h', 'h', 'h', 'h'],
        ['h', 'h', 'h', 'h', 'h'],
        ['h', 'h', 'h', 'h', 'h'],
      ]
    })
  }, [dispatch])

  function handleClick(row, col) {
    const index = Math.round(Math.random() * set.size)
    const value = Array.from(set)[index]
    // do async stuff...

    dispatch({
      type: 'CLICK_TARGET',
      value,
      row,
      col,
    })
  }

  return (
    <div className="App">
      <h1>Minesweeper</h1>
      <Grid grid={state.grid} onClick={handleClick} />
    </div>
  );
}

export default App;
