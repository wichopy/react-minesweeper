const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

class Board {
  constructor(W, H, numMines) {
    this.W = W
    this.H = H
    this.numMines = numMines
    this.grid = []

    this._searchVector = [
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

    this._traversed = {}
    this.generateEmpty()
  }

  generateEmpty() {
    for (let i = 0; i < this.H; i++) {
      this.grid[i] = []
      for (let j = 0; j < this.W; j++) {
        this.grid[i][j] = 'U'
      }
    }
  }

  isBomb(row, col) {
    return this.grid[row][col] === 'M'
  }

  populate(row, col) {
    const bombIndices = {}

    for (let i = 0; i < this.numMines; i++) {
      let randI = Math.floor(Math.random() * this.H)
      let randJ = Math.floor(Math.random() * this.W)

      // Try a new position if its already a mine.
      if (bombIndices[randI + ":" + randJ] || (randI === row && randJ === col)) {
        while (bombIndices[randI + ":" + randJ] || (randI === row && randJ === col)) {
          randI = Math.floor(Math.random() * this.H)
          randJ = Math.floor(Math.random() * this.W)
        }
      }

      bombIndices[randI + ":" + randJ] = true
    }

    for (let i = 0; i < this.H; i++) {
      for (let j = 0; j < this.W; j++) {
        if (bombIndices[i + ":" + j]) {
          this.grid[i][j] = 'M'
        }
      }
    }
  }

  _findSurroundingMines(row, col) {
    let mineCount = 0;
    let vector;
    for (let m = 0; m < this._searchVector.length; m++) {
      vector = this._searchVector[m];
      const rowvec = vector[0] + row;
      const colvec = vector[1] + col;
      if (
        rowvec >= 0 &&
        rowvec < this.grid.length &&
        colvec >= 0 &&
        colvec < this.grid[0].length
      ) {
        if (this.isBomb(rowvec, colvec)) {
          mineCount++;
        }
      }
    }

    return mineCount
  }

  update(row, col) {
    let numUpdates = 0;

    if (this.grid[row][col] === "U") {
      let mineCount = this._findSurroundingMines(row, col, this.grid)

      if (mineCount > 0) {
        this.grid[row][col] = mineCount + "";
        return 1
      }

      const queue = [];
      queue.push([row, col]);
      while (queue.length) {
        [row, col] = queue.shift();
        // Count bombs.
        mineCount = this._findSurroundingMines(row, col, this.grid)
        if (mineCount > 0) {
          this.grid[row][col] = mineCount + "";
        } else {
          this.grid[row][col] = "V";

          // Traverse neighbours if we are on a blank cell
          for (let i = 0; i < this._searchVector.length; i++) {
            let vectorI = this._searchVector[i][0] + row
            let vectorJ = this._searchVector[i][1] + col
            if (
              vectorI < 0 ||
              vectorI >= this.grid.length ||
              vectorJ < 0 ||
              vectorJ >= this.grid[0].length ||
              this._traversed[(vectorI) + ":" + (vectorJ)] ||
              this.grid[vectorI][vectorJ] !== "U"
            ) {
              continue;
            }
            // 🚨 This is important. Track traversals in a hash map so we dont repeat our search cells!!
            this._traversed[vectorI + ":" + vectorJ] = true

            // push neighboring blank cells to queue.
            queue.push([vectorI, vectorJ]);
          }
        }
        // Track number of cell changes
        numUpdates += 1
      }
    } else if (this.isBomb(row, col)) {
      this.grid[row][col] = "X";
      return 1
    }

    return numUpdates;
  }
}

class Game {
  constructor(W = 10, H = 10, numMines = 10) {
    this.W = W
    this.H = H
    this.numMines = numMines
    this.unvisitedCount = null
    this.status = "new"
    this.hasFirstClick = false
    this.board = null

    this.listeners = []
  }

  start() {
    this.board = new Board(this.W, this.H, this.numMines)
    this.status = 'playing'
    this.hasFirstClick = false
    this.unvisitedCount = null
  }

  click(row, col) {
    if (!this.hasFirstClick) {
      this.board.populate(row, col)
      this.unvisitedCount = this.W * this.H - this.numMines
      this.hasFirstClick = true
    } else if (this.board.isBomb(row, col)) {
      this.board.update(row, col)
      this.status = 'loses'
      this.broadcast()
      return
    }

    const numMoves = this.board.update(row, col)
    this.unvisitedCount -= numMoves

    if (this.unvisitedCount === 0) {
      this.status = 'wins'
    }

    this.broadcast()
  }

  subscribe(cb) {
    this.listeners.push(cb)
  }

  broadcast() {
    this.listeners.forEach(listener => {
      listener(this.board.grid)
    })
  }
}
(async function main() {

  const game = new Game()

  game.start()
  game.subscribe((grid) => {
    // print board on each broadcast
    console.log('Board:')
    let outputTopRow = '  '
    grid[0].forEach((col, j) => {
      outputTopRow += String(j) + ' '
    })
    console.log(outputTopRow)
    grid.forEach((row, i) => {
      let output = '' + i + ' '
      row.forEach((col) => {
        let filter = col === 'M' || col === 'U' ? '?' : col
        output += `${filter} `
      })
      output += ' ' + i
      console.log(output)
    })
    console.log(outputTopRow)
  })

  console.log('Starting a new game of minesweeper')

  function prompUser() {
    return new Promise((resolve, reject) => {
      readline.question(`Pick a square(separte with a space):`, (input) => {
        const [row, col] = input.split(' ')
        game.click(Number(row), Number(col))
        resolve()
      });
    })
  }

  while (game.status === 'playing') {
    await prompUser()
  }

  if (game.status === 'wins') {
    console.log('You win!')
  } else {
    console.log('You lose!')
  }
  readline.close()
})()
