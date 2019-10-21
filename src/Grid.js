import React, { useEffect } from 'react'
import './Grid.css'
import { useImmer } from 'use-immer';

export default function ({ row, col }) {
  const [state, update] = useImmer({
    grid: []
  })

  useEffect(() => {
    const grid = []
    console.log(row, col)
    for (let i = 0; i < row; i++) {
      console.log(grid)
      grid.push([])
      for (let j = 0; j < col; j++) {
        console.log('cell', i, j)
        grid[i].push('B')
      }
    }

    console.log(grid)
    update(draft => {
      draft.grid = grid
    })
  }, [col, row, update])

  console.log(state)
  return <div className="wrapper">
    {
      state.grid.map((row, i) => {
        return <div className="row">
          {row.map((cell, j) => {
            return <div key={i + ':' + j} className="cell"></div>
          })}
        </div>
      })
    }
  </div >
}