import React from 'react'

export default function TabToggle({ options, value, onChange }) {
  return (
    <div className="tabs">
      {options.map(({ key, label }) => (
        <button
          key={key}
          className={`tab ${value === key ? 'active' : ''}`}
          onClick={() => onChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}