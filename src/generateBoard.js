function generateBoard(numMines = 50, W = 25, H = 10) {
  const grid = []

  const bombIndices = {}

  for (let i = 0; i < numMines; i++) {
    let randI = Math.floor(Math.random() * H)
    let randJ = Math.floor(Math.random() * W)

    // Try a new position if its already a mine.
    if (bombIndices[randI + ":" + randJ]) {
      while (bombIndices[randI + ":" + randJ]) {
        randI = Math.floor(Math.random() * H)
        randJ = Math.floor(Math.random() * W)
      }
    }

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

  return { grid, W, H, numMines }
}

export default generateBoard