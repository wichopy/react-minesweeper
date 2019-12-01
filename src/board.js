export function populate(grid, protectedCell, numMines = 50, W = 25, H = 10) {
  const bombIndices = {}

  for (let i = 0; i < numMines; i++) {
    let randI = Math.floor(Math.random() * H)
    let randJ = Math.floor(Math.random() * W)

    // Try a new position if its already a mine.
    if (bombIndices[randI + ":" + randJ] || (randI === protectedCell[0] && randJ === protectedCell[1])) {
      while (bombIndices[randI + ":" + randJ] || (randI === protectedCell[0] && randJ === protectedCell[1])) {
        randI = Math.floor(Math.random() * H)
        randJ = Math.floor(Math.random() * W)
      }
    }

    bombIndices[randI + ":" + randJ] = true
  }

  for (let i = 0; i < H; i++) {
    for (let j = 0; j < W; j++) {
      if (bombIndices[i + ":" + j]) {
        grid[i][j] = 'M'
      }
    }
  }

  return grid
}

export function generateEmpty(W = 25, H = 10) {
  const grid = []
  for (let i = 0; i < H; i++) {
    grid[i] = []
    for (let j = 0; j < W; j++) {
      grid[i][j] = 'U'
    }
  }
  return grid
}

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

function isWithinBounds(row, col, board) {
  return row >= 0 &&
    row < board.length &&
    col >= 0 &&
    col < board[0].length
}

function findSurroundingMines(row, col, board) {
  let mineCount = 0;
  let vector;
  for (let m = 0; m < searchVector.length; m++) {
    vector = searchVector[m];
    const rowvec = Number(vector[0] + row);
    const colvec = Number(vector[1] + col);
    if (
      isWithinBounds(rowvec, colvec, board)
    ) {
      if (board[rowvec][colvec] === "M") {
        mineCount++;
      }
    }
  }

  return mineCount
}

export function update(board, click) {
  let [row, col] = click;
  const traversed = {}
  let numUpdates = 0;

  if (board[row][col] === "U") {
    let mineCount = findSurroundingMines(row, col, board)

    if (mineCount > 0) {
      board[row][col] = mineCount + "";
      return { board, numUpdates: 1 }
    }

    const queue = [];
    queue.push([row, col]);
    while (queue.length) {
      [row, col] = queue.shift();
      // Count bombs.
      mineCount = findSurroundingMines(row, col, board)
      if (mineCount > 0) {
        board[row][col] = mineCount + "";
      } else {
        board[row][col] = "V";

        // Traverse neighbours if we are on a blank cell
        for (let i = 0; i < searchVector.length; i++) {
          let vectorI = searchVector[i][0] + row
          let vectorJ = searchVector[i][1] + col
          if (
            !isWithinBounds(vectorI, vectorJ, board) ||
            traversed[(vectorI) + ":" + (vectorJ)] ||
            board[vectorI][vectorJ] !== "U"
          ) {
            continue;
          }
          // 🚨 This is important. Track traversals in a hash map so we dont repeat our search cells!!
          traversed[vectorI + ":" + vectorJ] = true

          // push neighboring blank cells to queue.
          queue.push([vectorI, vectorJ]);
        }
      }
      // Track number of cell changes
      numUpdates += 1
    }
  } else if (board[row][col] === "M") {
    board[row][col] = "X";
  }

  return { board, numUpdates };
};