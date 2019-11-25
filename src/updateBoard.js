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
  const traversed = {}
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
      if (mineCount > 0) {
        board[row][col] = mineCount + "";
        // callback("UPDATE_CELL_MINE_ADJ", row, col, mineCount);
        // yield boardCopy;
      } else {
        board[row][col] = "V";
        // callback("UPDATE_CELL_BLANK", row, col);
        // yield boardCopy;

        // Traverse neighbours if we are on a blank cell
        for (let i = 0; i < searchVector.length; i++) {
          let vectorI = searchVector[i][0] + row
          let vectorJ = searchVector[i][1] + col
          if (
            vectorI < 0 ||
            vectorI >= board.length ||
            vectorJ < 0 ||
            vectorJ >= board[0].length ||
            traversed[(vectorI) + ":" + (vectorJ)] ||
            board[vectorI][vectorJ] !== "U"
          ) {
            // console.log(traversed)
            continue;
          }

          // push neighboring blank cells to stack.
          // callback(
          //   "FOUND_EMPTY",
          //   vectorI,
          //   vectorJ
          // );
          // 🚨 This is important. Track traversals in a hash map so we dont repeat our search cells!!
          traversed[vectorI + ":" + vectorJ] = true
          stack.push([vectorI, vectorJ]);
        }
      }
      numUpdates += 1
    }
  } else if (board[row][col] === "M") {
    board[row][col] = "X";
  }

  // callback("KILL");
  // console.log(boardCopy);
  return { board, numUpdates };
};

export default updateBoard