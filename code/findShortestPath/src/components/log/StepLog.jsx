import React, { useEffect, useRef } from 'react'
import { PHASE_COLORS } from '../../constants/colors'

export default function StepLog({ steps, stepIdx, onSelect }) {
  const activeRef = useRef(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [stepIdx])

  if (!steps || steps.length === 0) {
    return (
      <p className="empty-state">
        Configure the graph and run<br />
        an algorithm to see the<br />
        step-by-step execution log.
      </p>
    )
  }

  return (
    <>
      {steps.map((s, i) => (
        <div
          key={i}
          ref={i === stepIdx ? activeRef : null}
          className={[
            'step-item',
            i === stepIdx ? 'active' : '',
            i <  stepIdx ? 'done'   : '',
          ].join(' ')}
          onClick={() => onSelect(i)}
        >
          <span className="step-num">{i + 1}</span>
          <span
            className="step-phase"
            style={{ color: PHASE_COLORS[s.phase] ?? '#3a7bd5' }}
          >
            [{s.phase}]
          </span>
          <span className="step-desc">{s.desc}</span>
        </div>
      ))}
    </>
  )
}