import React from 'react'
import { NODE_COLORS, EDGE_COLORS } from '../../constants/colors'
import { CANVAS } from '../../constants/config'

const { width: W, height: H, nodeRadius: R } = CANVAS

export default function GraphCanvas({
  matrix, positions, step, stepIdx, result, source, target, algorithm,
}) {
  const n       = matrix.length
  const isDone  = result && stepIdx >= result.steps.length - 1


  const getNodeColor = (i) => {
    if (i === source) return NODE_COLORS.source
    if (i === target) return NODE_COLORS.target
    if (!step)        return NODE_COLORS.unvisited

    const vis = step.visited ?? step.closed ?? []
    const iq  = step.inQueue ?? step.open   ?? []

    if (i === step.current) return NODE_COLORS.current
    if (vis[i])             return NODE_COLORS.visited
    if (iq[i])              return NODE_COLORS.inQueue
    return NODE_COLORS.unvisited
  }

  const getDistLabel = (i) => {
    if (!step) return null
    const arr = step.dist ?? step.g ?? []
    const v   = arr[i]
    if (v === undefined || v === Infinity) return '∞'
    return algorithm === 'astar' ? v.toFixed(1) : String(v)
  }

  const isOnPath = (i, j) => {
    if (!isDone || !result?.path || result.path.length < 2) return false
    for (let k = 0; k < result.path.length - 1; k++) {
      const a = result.path[k], b = result.path[k + 1]
      if ((a === i && b === j) || (a === j && b === i)) return true
    }
    return false
  }

  const isActiveEdge = (i, j) =>
    step && (
      (step.current === i && step.neighbor === j) ||
      (step.current === j && step.neighbor === i)
    )

  const isTreeEdge = (i, j) => {
    if (!step?.prev) return false
    return step.prev[j] === i || step.prev[i] === j
  }

  const edgeLabelPos = (p1, p2) => {
    const mx = (p1.x + p2.x) / 2
    const my = (p1.y + p2.y) / 2
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    return { x: mx + (-dy / len) * 7, y: my + (dx / len) * 7 }
  }


  return (
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${H}`}
      style={{
        display: 'block',
        background: '#f8f5ef',
        borderRadius: 3,
        border: '1px solid #e2dace',
        flex: 1,
      }}
    >
      {/* Background grid */}
      {Array.from({ length: 15 }, (_, k) => (
        <line key={`hg${k}`} x1="0" y1={k * 25} x2={W} y2={k * 25}
          stroke="#ede8df" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 25 }, (_, k) => (
        <line key={`vg${k}`} x1={k * 25} y1="0" x2={k * 25} y2={H}
          stroke="#ede8df" strokeWidth="0.5" />
      ))}

      {/* ── Edges ── */}
      {Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) => {
          if (j <= i || !matrix[i][j] || !positions[i] || !positions[j]) return null
          const onPath = isOnPath(i, j)
          const active = isActiveEdge(i, j)
          const tree   = isTreeEdge(i, j)
          const p1     = positions[i]
          const p2     = positions[j]
          const lp     = edgeLabelPos(p1, p2)

          return (
            <g key={`e${i}-${j}`}>
              <line
                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke={
                  onPath ? EDGE_COLORS.path
                  : active ? EDGE_COLORS.active
                  : tree   ? EDGE_COLORS.tree
                  :          EDGE_COLORS.default
                }
                strokeWidth={onPath ? 2.5 : active ? 2 : tree ? 1.8 : 1.2}
                strokeDasharray={active ? '7,3' : undefined}
                opacity={onPath || active ? 1 : 0.75}
              />
              {/* Weight label */}
              <rect
                x={lp.x - 13} y={lp.y - 8}
                width="26" height="14" rx="3"
                fill="rgba(248,245,239,0.92)"
              />
              <text
                x={lp.x} y={lp.y + 4}
                textAnchor="middle"
                fontSize="9"
                fontFamily="'Courier New', monospace"
                fill={active ? EDGE_COLORS.active : onPath ? EDGE_COLORS.path : '#7a6a58'}
                fontWeight={active || onPath ? 'bold' : 'normal'}
              >
                {matrix[i][j]}
              </text>
            </g>
          )
        })
      )}

      {/* ── Nodes ── */}
      {positions.map((pos, i) => {
        if (!pos) return null
        const color    = getNodeColor(i)
        const distLabel = getDistLabel(i)
        const isCurrent = step?.current === i

        return (
          <g key={`n${i}`}>
            {/* Glow ring for currently-expanded node */}
            {isCurrent && (
              <circle cx={pos.x} cy={pos.y} r={R + 7}
                fill="none" stroke={color} strokeWidth="1.5" opacity="0.35" />
            )}
            <circle
              cx={pos.x} cy={pos.y} r={R}
              fill={color} stroke="white" strokeWidth="1.5"
            />
            {/* Node index */}
            <text
              x={pos.x} y={pos.y + 5}
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="bold"
              fontFamily="'Courier New', monospace"
            >
              {i}
            </text>
            {/* Distance / g-cost label below node */}
            {distLabel && (
              <text
                x={pos.x} y={pos.y + R + 14}
                textAnchor="middle"
                fontSize="9"
                fontFamily="'Courier New', monospace"
                fill={color}
                fontWeight="600"
              >
                {distLabel}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}