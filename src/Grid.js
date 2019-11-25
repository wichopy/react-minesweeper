import React from 'react'
import './Grid.css'

function CellContent({ fill }) {
  let render
  switch (fill) {
    case 'X':
      render = 'bomb'
      break;
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
      render = fill
      break;
    case 'M':
    case 'V':
    case 'U':
    default:
      render = null
  }

  return render
}

export default function ({ grid, row, col, onClick }) {
  // const [state, update] = useImmer({
  //   grid: []
  // })

  // useEffect(() => {
  //   const grid = []
  //   console.log(row, col)
  //   for (let i = 0; i < row; i++) {
  //     console.log(grid)
  //     grid.push([])
  //     for (let j = 0; j < col; j++) {
  //       console.log('cell', i, j)
  //       grid[i].push('B')
  //     }
  //   }

  //   console.log(grid)
  //   update(draft => {
  //     draft.grid = grid
  //   })
  // }, [col, row, update])

  // console.log(state)
  // return <div className="wrapper">
  //   {
  //     state.grid.map((row, i) => {
  //       return <div className="row">
  //         {row.map((cell, j) => {
  //           return <div key={i + ':' + j} className="cell"></div>
  //         })}
  //       </div>
  //     })
  //   }
  // </div >
  if (!grid) return null

  return grid.map((row, i) => {
    return <div key={i} className="row">
      {
        row.map((cell, j) => {
          return <div key={i + ':' + j} className={`cell cell-${cell}`} onClick={() => {
            if (cell === 'U' || cell === 'M') {
              onClick(i, j, cell)
            }
          }} >
            <CellContent fill={cell} />
          </div >
        })
      }
    </div>
  })
}