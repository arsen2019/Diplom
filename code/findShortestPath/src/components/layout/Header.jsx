import React from 'react'

export default function Header({ algorithm, onAlgorithmChange }) {
  return (
    <header className="header">
      <div>
        <span className="header-badge">Bachelor Thesis · Algorithm Visualizer</span>
        <div className="header-title">Dijkstra &amp; A* Pathfinding</div>
        <div className="header-sub">
          Step-by-step analysis of weighted graph traversal algorithms
        </div>
      </div>

      <div className="algo-toggle">
        {[
          { key: 'dijkstra', label: 'Dijkstra' },
          { key: 'astar',    label: 'A* Search' },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={`algo-btn ${algorithm === key ? 'active' : ''}`}
            onClick={() => onAlgorithmChange(key)}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  )
}