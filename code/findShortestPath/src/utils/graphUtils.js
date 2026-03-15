import { GRAPH_DEFAULTS } from '../constants/config'
export function generateMatrix(
  n,
  density = GRAPH_DEFAULTS.density,
  minW    = GRAPH_DEFAULTS.minWeight,
  maxW    = GRAPH_DEFAULTS.maxWeight,
) {
  const m = Array.from({ length: n }, () => new Array(n).fill(0))

  const randWeight = () => Math.floor(Math.random() * (maxW - minW + 1)) + minW

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.random() < density) {
        const w = randWeight()
        m[i][j] = w
        m[j][i] = w
      }
    }
  }

  for (let i = 0; i < n - 1; i++) {
    if (m[i][i + 1] === 0) {
      const w = randWeight()
      m[i][i + 1] = w
      m[i + 1][i] = w
    }
  }

  return m
}

export function setEdge(matrix, i, j, weight) {
  const n = matrix.length
  const w = Math.max(0, parseInt(weight) || 0)
  return matrix.map((row, r) =>
    row.map((val, c) => {
      if ((r === i && c === j) || (r === j && c === i)) return w
      return val
    }),
  )
}

export function edgeCount(matrix) {
  let count = 0
  for (let i = 0; i < matrix.length; i++)
    for (let j = i + 1; j < matrix.length; j++)
      if (matrix[i][j] > 0) count++
  return count
}