import React from 'react'

export default function DistTable({ step, stepIdx, result, n, source, target, algorithm }) {


  const isDone  = result && stepIdx >= result.steps.length - 1
  const isAstar = algorithm === 'astar'

  const distArr = step ? (step.dist ?? step.g   ?? []) : []
  const fArr    = step ? (step.f    ?? [])              : []
  const prev    = step ? (step.prev ?? [])              : []
  const vis     = step ? (step.visited ?? step.closed ?? []) : []
  const iq      = step ? (step.inQueue ?? step.open   ?? []) : []

  const fmt = (v) => {
    if (v === undefined || v === Infinity) return '∞'
    if (typeof v !== 'number')            return v
    return Number.isInteger(v) ? String(v) : v.toFixed(2)
  }

  const statusOf = (i) => {
    if (vis[i]) return { label: '✓ vis',  color: '#27ae60' }
    if (iq[i])  return { label: '⏳ open', color: '#d4890a' }
    return        { label: '○',       color: '#9a8a7a' }
  }

  return (
    <div className="dist-section">
      <div className="card-title" style={{ margin: '0 0 6px' }}>
        State table
      </div>

      {!step ? (
        <p className="dist-placeholder">
          Run an algorithm to see the live state table.
        </p>
      ) : (
        <>
          <table className="dist-table">
            <thead>
              <tr>
                <th>Node</th>
                <th>{isAstar ? 'g(n)' : 'dist'}</th>
                {isAstar && <th>f(n)</th>}
                <th>prev</th>
                <th>status</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: n }, (_, i) => {
                const st = statusOf(i)
                return (
                  <tr key={i} className={i === step.current ? 'current-row' : ''}>
                    <td>
                      {i}
                      {i === source ? ' ⊕' : ''}
                      {i === target ? ' ⊗' : ''}
                    </td>
                    <td>{fmt(distArr[i])}</td>
                    {isAstar && <td>{fmt(fArr[i])}</td>}
                    <td>{prev[i] == null ? '—' : prev[i]}</td>
                    <td style={{ color: st.color }}>{st.label}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {isDone && result?.path?.length > 0 && (
            <div className="path-box">
              <strong>Path:</strong>&nbsp;{result.path.join(' → ')}<br />
              <strong>Cost:</strong>&nbsp;{fmt(distArr[target])}
            </div>
          )}

          {isDone && result?.path?.length === 0 && (
            <div className="path-box path-box--error">
              No path found from {source} to {target}.
            </div>
          )}
        </>
      )}
    </div>
  )
}