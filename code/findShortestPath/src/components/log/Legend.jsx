import React from 'react'
import { NODE_COLORS } from '../../constants/colors'

const ITEMS = [
  { color: NODE_COLORS.source,    label: 'Source node (⊕)' },
  { color: NODE_COLORS.target,    label: 'Target node (⊗)' },
  { color: NODE_COLORS.unvisited, label: 'Unvisited node' },
  { color: NODE_COLORS.inQueue,   label: 'In queue / open set' },
  { color: NODE_COLORS.current,   label: 'Currently expanding' },
  { color: NODE_COLORS.visited,   label: 'Visited / closed set' },
]

export default function Legend() {
  return (
    <>
      {ITEMS.map(({ color, label }) => (
        <div key={label} className="legend-item">
          <span className="legend-dot" style={{ background: color }} />
          <span className="legend-label">{label}</span>
        </div>
      ))}
    </>
  )
}