const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const Game = require('./game.js')

async function main() {
  const game = new Game()
  game.start()

  // Game renderer:
  game.subscribe(({ grid, status }) => {
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

  // Game loop
  while (game.status === 'playing') {
    await prompUser()
  }

  if (game.status === 'wins') {
    console.log('You win!')
  } else {
    console.log('You lose!')
  }
  readline.close()
}

main()