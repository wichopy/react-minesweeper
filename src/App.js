import React, { useEffect } from 'react';
import './App.css';
import Grid from './Grid';
import updateBoard from './updateBoard'
import generateBoard from './generateBoard';

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
      draft.grid = null
      break;
    case 'CLICK_TARGET':
      if (action.value === 'M') {
        draft.status = 'loses'
        draft.grid[action.row][action.col] = "X"
        break;
      }
      const { board, numUpdates } = updateBoard(draft.grid, [action.row, action.col])
      draft.grid = board
      draft.unvisitedCount -= numUpdates
      break;
    case 'BUILD_GRID':
      const { grid, numMines, W, H } = generateBoard()
      draft.grid = grid
      draft.mineCount = numMines
      draft.unvisitedCount = W * H - numMines
      break;
    case 'USER_WINS':
      draft.status = 'wins'
      break;
    default:
      return draft;
  }
}

function App() {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    if (state.status === 'playing' && !state.grid) {

      dispatch({
        type: 'BUILD_GRID',
      })
    }
  }, [dispatch, state.grid, state.status])

  useEffect(() => {
    if (state.unvisitedCount === 0) {
      dispatch({
        type: 'USER_WINS'
      })
    }
  }, [dispatch, state])

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
      {/* <h1>Minesweeper</h1> */}
      {state.status === 'wins' && <h3>Congrats! You won!</h3>}
      {state.status === 'loses' && <div>
        You hit a mine, try again?
      </div>}
      {state.status !== 'new' && state.status !== 'playing' && <button onClick={handleNewGameClick}>Replay</button>}
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
