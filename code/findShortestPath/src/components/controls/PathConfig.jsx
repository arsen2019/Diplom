import React from 'react'

export default function PathConfig({
  source, target, nodeCount, algorithm, onSource, onTarget, onRun,
}) {
  const nodes = Array.from({ length: nodeCount }, (_, i) => i)

  return (
    <>
      <div className="form-row">
        <div className="form-group">
          <span className="label">Source ⊕</span>
          <select value={source} onChange={e => onSource(Number(e.target.value))}>
            {nodes.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div className="form-group">
          <span className="label">Target ⊗</span>
          <select value={target} onChange={e => onTarget(Number(e.target.value))}>
            {nodes.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </div>

      <button className="btn-run" onClick={onRun}>
        ▶&nbsp;Run {algorithm === 'dijkstra' ? 'Dijkstra' : 'A*'}
      </button>
    </>
  )
}