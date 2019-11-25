import React, { useEffect } from 'react';
import './App.css';
import Grid from './Grid';

import { useImmerReducer } from 'use-immer';

const initialState = {
  grid: null,
  status: 'new',
  mineCount: null,
  unvisitedCount: null,
}

function reducer(draft, action) {
  switch (action.type) {
    case 'START_NEW_GAME':
      draft.status = 'playing'
      break;
    case 'CLICK_TARGET':
      console.log(action)
      draft.grid[action.row][action.col] = action.value
      break;
    case 'BUILD_GRID':
      draft.grid = action.grid
      draft.mineCount = action.mineCount
      draft.unvisitedCount = action.unvisitedCount
      break;
    default:
      return draft;
  }
}

const set = new Set(['M', 'X', 'U', 'V', '1', '2', '3', '4', '5', '6', '7', '8'])

function App() {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    if (state.status === 'playing' && !state.grid) {
      const numMines = 10;
      const W = 6
      const H = 6
      const grid = []

      const bombIndices = {}

      for (let i = 0; i < numMines; i++) {
        let randI = Math.floor(Math.random() * W)
        let randJ = Math.floor(Math.random() * H)

        // Try a new position if its already a mine.
        if (bombIndices[randI + ":" + randJ]) {
          while (bombIndices[randI + ":" + randJ]) {
            console.log('find new index other than ', randI, randJ)
            randI = Math.floor(Math.random() * W)
            randJ = Math.floor(Math.random() * H)
          }
        }

        console.log('add bomb at ', randI, randJ)
        bombIndices[randI + ":" + randJ] = true
      }

      for (let i = 0; i < H; i++) {
        grid[i] = []
        for (let j = 0; j < W; j++) {
          if (bombIndices[i + ":" + j]) {
            grid[i][j] = 'M'
          } else {
            grid[i][j] = 'U'
          }
        }
      }
      dispatch({
        type: 'BUILD_GRID',
        grid,
        mineCount: numMines,
        unvisitedCount: W * H - numMines
      })
    }
  }, [dispatch, state.grid, state.status])

  function handleClick(row, col, value) {
    // do async stuff...

    dispatch({
      type: 'CLICK_TARGET',
      value: value === 'U' ? 'visited' : 'X',
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
      {/* <h1>Minesweeper</h1> */}
      {
        state.state !== 'new' && (
          <Grid grid={state.grid} onClick={handleClick} />
        )
      }
    </div>
  );
}

export default App;
