import updateBoard from './updateBoard'
import generateBoard from './generateBoard';

export const initialState = {
  grid: null,
  status: 'new',
  mineCount: null,
  unvisitedCount: null,
}

export function reducer(draft, action) {
  switch (action.type) {
    case 'START_NEW_GAME':
      draft.status = 'playing'
      const { grid, numMines, W, H } = generateBoard()
      draft.grid = grid
      draft.mineCount = numMines
      draft.unvisitedCount = W * H - numMines
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
      if (draft.unvisitedCount === 0) {
        draft.status = 'wins'
      }
      break;
    case 'USER_WINS':
      draft.status = 'wins'
      break;
    default:
      return draft;
  }
}