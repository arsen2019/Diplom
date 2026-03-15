import React from 'react'
import { PLAYBACK } from '../../constants/config'

export default function PlaybackControls({
  playing, stepIdx, totalSteps, speedMs,
  onPlay, onPause, onStepBack, onStepForward,
  onJumpStart, onJumpEnd, onSpeedChange,
}) {
  const sliderValue = PLAYBACK.maxSpeedMs + PLAYBACK.minSpeedMs - speedMs

  return (
    <div className="controls">
      <button className="ctrl-btn" title="Jump to start" onClick={onJumpStart}>⏮</button>
      <button className="ctrl-btn" title="Step back"     onClick={onStepBack}>◀</button>
      <div className="ctrl-divider" />
      <button
        className="ctrl-btn play"
        onClick={playing ? onPause : onPlay}
      >
        {playing ? '⏸ Pause' : '▶ Play'}
      </button>
      <div className="ctrl-divider" />
      <button className="ctrl-btn" title="Step forward" onClick={onStepForward}>▶</button>
      <button className="ctrl-btn" title="Jump to end"  onClick={onJumpEnd}>⏭</button>

      <div className="speed-wrap">
        <span className="label">Speed</span>
        <input
          type="range"
          min={PLAYBACK.minSpeedMs}
          max={PLAYBACK.maxSpeedMs}
          step="100"
          value={sliderValue}
          onChange={e => onSpeedChange(PLAYBACK.maxSpeedMs + PLAYBACK.minSpeedMs - Number(e.target.value))}
          style={{ width: 64 }}
        />
      </div>

      <span className="step-counter">{stepIdx + 1} / {totalSteps}</span>
    </div>
  )
}