import { useState, useCallback } from 'react'
import { generateMatrix, setEdge } from '../utils/graphUtils'
import { generatePositions }       from '../utils/positionUtils'
import { GRAPH_DEFAULTS }          from '../constants/config'

export function useGraph() {
  const [nodeCount, setNodeCount] = useState(GRAPH_DEFAULTS.nodeCount)
  const [density,   setDensity]   = useState(GRAPH_DEFAULTS.density)
  const [matrix,    setMatrix]    = useState(() => generateMatrix(GRAPH_DEFAULTS.nodeCount, GRAPH_DEFAULTS.density))
  const [positions, setPositions] = useState(() => generatePositions(GRAPH_DEFAULTS.nodeCount))

  const regenerate = useCallback((count = nodeCount, dens = density) => {
    setMatrix(generateMatrix(count, dens))
    setPositions(generatePositions(count))
  }, [nodeCount, density])

  const updateEdge = useCallback((i, j, weight) => {
    setMatrix(prev => setEdge(prev, i, j, weight))
  }, [])

  return {
    matrix, positions,
    nodeCount, density,
    setNodeCount, setDensity,
    regenerate,
    updateEdge,
  }
}