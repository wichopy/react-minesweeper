import { generateEmpty, populate, update } from './board';

export const initialState = {
  grid: null,
  status: 'new',
  mineCount: null,
  unvisitedCount: null,
  hasFirstClick: false,
}

export function reducer(draft, action) {
  let numMines = 50
  const W = 25
  const H = 10

  switch (action.type) {
    case 'START_NEW_GAME':
      draft.status = 'playing'
      const grid = generateEmpty(W, H)
      draft.grid = grid
      draft.hasFirstClick = false
      break;
    case 'CLICK_TARGET':
      if (!draft.hasFirstClick) {

        const grid = populate(draft.grid, [action.row, action.col], numMines, W, H)
        draft.grid = grid
        draft.mineCount = numMines
        draft.unvisitedCount = W * H - numMines
        draft.hasFirstClick = true
      } else if (action.value === 'M') {
        draft.status = 'loses'
        draft.grid[action.row][action.col] = "X"
        break;
      }

      const { board, numUpdates } = update(draft.grid, [action.row, action.col])
      draft.grid = board
      draft.unvisitedCount -= numUpdates
      if (draft.unvisitedCount === 0) {
        draft.status = 'wins'
      }
      break;
    default:
      return draft;
  }
}