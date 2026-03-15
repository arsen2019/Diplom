import React from 'react'

export default function GraphGenerator({
  nodeCount, density, onNodeCount, onDensity, onGenerate,
}) {
  return (
    <>
      <div className="form-group">
        <span className="label">
          Nodes: <strong>{nodeCount}</strong>
        </span>
        <input
          type="range" min="3" max="12" value={nodeCount}
          onChange={e => onNodeCount(Number(e.target.value))}
        />
      </div>

      <div className="form-group">
        <span className="label">
          Edge density: <strong>{Math.round(density * 100)}%</strong>
        </span>
        <input
          type="range" min="0.2" max="0.9" step="0.05" value={density}
          onChange={e => onDensity(Number(e.target.value))}
        />
      </div>

      <button className="btn-gen" onClick={onGenerate}>
        Generate Graph
      </button>
    </>
  )
}