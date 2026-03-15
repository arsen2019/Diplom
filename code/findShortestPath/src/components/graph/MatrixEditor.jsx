import React from 'react'

export default function MatrixEditor({ matrix, onEdgeChange }) {
  const n = matrix.length

  return (
    <div className="matrix-wrapper">
      <p className="matrix-hint">Adjacency matrix — 0 means no edge:</p>
      <table className="matrix-table">
        <thead>
          <tr>
            <th style={{ background: 'none' }} />
            {Array.from({ length: n }, (_, i) => (
              <th key={i}>{i}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              {/* Row header */}
              <th style={{
                padding: '3px 4px',
                background: '#f5f0e8',
                fontFamily: 'Courier New, monospace',
                fontSize: 10,
                color: '#6a5a4a',
                fontWeight: 700,
              }}>
                {i}
              </th>

              {row.map((val, j) => (
                <td key={j}>
                  {i === j ? (
                    <span className="m-diag">—</span>
                  ) : (
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={val}
                      className={`m-input ${val > 0 ? 'active' : ''}`}
                      onChange={e => onEdgeChange(i, j, e.target.value)}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}