import { useState, useCallback } from 'react'
import { runDijkstra, runAstar }  from '../algorithms'

export function useAlgorithm(matrix, positions) {
  const [algorithm, setAlgorithm] = useState('dijkstra')
  const [source,    setSource]    = useState(0)
  const [target,    setTarget]    = useState(() => Math.max(1, (matrix?.length ?? 2) - 1))
  const [result,    setResult]    = useState(null)

  const run = useCallback(() => {
    if (!matrix || matrix.length === 0) return
    const res = algorithm === 'dijkstra'
      ? runDijkstra(matrix, source, target)
      : runAstar(matrix, source, target, positions)
    setResult(res)
  }, [algorithm, matrix, positions, source, target])

  const reset = useCallback(() => setResult(null), [])

  const handleSetAlgorithm = useCallback((alg) => {
    setAlgorithm(alg)
    setResult(null)
  }, [])

  const handleSetSource = useCallback((s) => { setSource(s); setResult(null) }, [])
  const handleSetTarget = useCallback((t) => { setTarget(t); setResult(null) }, [])

  return {
    algorithm, setAlgorithm: handleSetAlgorithm,
    source,    setSource:    handleSetSource,
    target,    setTarget:    handleSetTarget,
    result,
    run,
    reset,
  }
}