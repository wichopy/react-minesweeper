import React, { useEffect } from 'react';
import './App.css';
import Grid from './Grid';

import { useImmerReducer } from 'use-immer';
const searchVector = [
  // top 3
  [-1, -1],
  [-1, 0],
  [-1, 1],
  // middle right
  [0, 1],
  // bottom 3
  [1, 1],
  [1, 0],
  [1, -1],
  // middle left
  [0, -1]
];

function findSurroundingMines(row, col, board) {
  console.log('find surrounding mines at', row, col, board)
  let mineCount = 0;
  let vector;
  for (let m = 0; m < searchVector.length; m++) {
    vector = searchVector[m];
    const rowvec = vector[0] + row;
    const colvec = vector[1] + col;
    if (
      rowvec >= 0 &&
      rowvec < board.length &&
      colvec >= 0 &&
      colvec < board[0].length
    ) {
      if (board[rowvec][colvec] === "M") {
        // callback("FOUND_MINE", rowvec, colvec);
        // yield board;
        mineCount++;
      }
    }
  }

  return mineCount
}

function updateBoard(board, click) {
  let [row, col] = click;
  let numUpdates = 0;
  if (board[row][col] === "U") {
    // callback("FOUND_EMPTY", row, col);
    let mineCount = findSurroundingMines(row, col, board)

    if (mineCount > 0) {
      board[row][col] = mineCount + "";
      return { board, numUpdates: 1 }
    }

    const stack = [];
    stack.push([row, col]);
    while (stack.length) {
      [row, col] = stack.shift();
      // Count bombs.
      mineCount = findSurroundingMines(row, col, board)
      numUpdates += 1
      if (mineCount > 0) {
        board[row][col] = mineCount + "";
        // callback("UPDATE_CELL_MINE_ADJ", row, col, mineCount);
        // yield board;
      } else {
        board[row][col] = "V";
        // callback("UPDATE_CELL_BLANK", row, col);
        // yield board;

        // Traverse neighbours if we are on a blank cell
        for (let i = 0; i < searchVector.length; i++) {
          if (
            searchVector[i][0] + row < 0 ||
            searchVector[i][0] + row >= board.length ||
            searchVector[i][1] + col < 0 ||
            searchVector[i][1] + col >= board[0].length ||
            board[searchVector[i][0] + row][searchVector[i][1] + col] !== "U"
          ) {
            continue;
          }

          // push neighboring blank cells to stack.
          // callback(
          //   "FOUND_EMPTY",
          //   searchVector[i][0] + row,
          //   searchVector[i][1] + col
          // );

          stack.push([searchVector[i][0] + row, searchVector[i][1] + col]);
        }
      }
    }
    // emptyRecurse(board, click, callback);
  } else if (board[row][col] === "M") {
    board[row][col] = "X";
  }

  // callback("KILL");
  // console.log(board);
  return { board, numUpdates };
};

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
      console.log(draft)
      const { board, numUpdates } = updateBoard(draft.grid, [action.row, action.col])
      draft.grid = board
      draft.unvisitedCount -= numUpdates
      break;
    case 'BUILD_GRID':
      draft.grid = action.grid
      draft.mineCount = action.mineCount
      draft.unvisitedCount = action.unvisitedCount
      break;
    case 'USER_WINS':
      draft.status = 'wins'
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
