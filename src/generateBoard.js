function generateBoard() {

  const numMines = 10;
  const W = 12
  const H = 12
  const grid = []

  const bombIndices = {}

  for (let i = 0; i < numMines; i++) {
    let randI = Math.floor(Math.random() * W)
    let randJ = Math.floor(Math.random() * H)

    // Try a new position if its already a mine.
    if (bombIndices[randI + ":" + randJ]) {
      while (bombIndices[randI + ":" + randJ]) {
        randI = Math.floor(Math.random() * W)
        randJ = Math.floor(Math.random() * H)
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