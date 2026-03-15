import React, { useState } from 'react'

// Layout
import Header from './components/layout/Header'

// Controls
import TabToggle       from './components/controls/TabToggle'
import GraphGenerator  from './components/controls/GraphGenerator'
import PathConfig      from './components/controls/PathConfig'
import PlaybackControls from './components/controls/PlaybackControls'

// Graph
import GraphCanvas  from './components/graph/GraphCanvas'
import MatrixEditor from './components/graph/MatrixEditor'

// Log / info
import StepLog   from './components/log/StepLog'
import DistTable from './components/log/DistTable'
import Legend    from './components/log/Legend'

// Hooks
import { useGraph }     from './hooks/useGraph'
import { useAlgorithm } from './hooks/useAlgorithm'
import { usePlayback }  from './hooks/usePlayback'

const INPUT_TABS = [
  { key: 'auto',   label: '⚡ Auto' },
  { key: 'manual', label: '✎ Matrix' },
]

export default function App() {
  // ── State ─────────────────────────────────────────────
  const [inputTab, setInputTab] = useState('auto')

  const {
    matrix, positions,
    nodeCount, density,
    setNodeCount, setDensity,
    regenerate, updateEdge,
  } = useGraph()

  const {
    algorithm, setAlgorithm,
    source,    setSource,
    target,    setTarget,
    result,    run, reset,
  } = useAlgorithm(matrix, positions)

  const {
    stepIdx, setStepIdx,
    playing,
    speedMs, setSpeedMs,
    play, pause,
    stepForward, stepBack,
    jumpStart, jumpEnd,
    currentStep,
    totalSteps,
  } = usePlayback(result)

  // ── Handlers ──────────────────────────────────────────

  const handleGenerate = () => {
    regenerate(nodeCount, density)
    reset()
  }

  const handleNodeCount = (n) => {
    setNodeCount(n)
    // Clamp source/target to new range
    if (source >= n) setSource(0)
    if (target >= n) setTarget(n - 1)
  }

  // ── Render ────────────────────────────────────────────

  return (
    <div className="app">
      <Header algorithm={algorithm} onAlgorithmChange={setAlgorithm} />

      <div className="body">

        {/* ══ LEFT SIDEBAR ══════════════════════════════ */}
        <aside className="sidebar">

          {/* Graph input */}
          <div className="card">
            <div className="card-title">Graph Input</div>
            <TabToggle options={INPUT_TABS} value={inputTab} onChange={setInputTab} />

            {inputTab === 'auto' ? (
              <GraphGenerator
                nodeCount={nodeCount}
                density={density}
                onNodeCount={handleNodeCount}
                onDensity={setDensity}
                onGenerate={handleGenerate}
              />
            ) : (
              <MatrixEditor matrix={matrix} onEdgeChange={updateEdge} />
            )}
          </div>

          {/* Path config + run */}
          <div className="card">
            <div className="card-title">Path Config</div>
            <PathConfig
              source={source}
              target={target}
              nodeCount={matrix.length}
              algorithm={algorithm}
              onSource={setSource}
              onTarget={setTarget}
              onRun={run}
            />
          </div>

          {/* Legend */}
          <div className="card">
            <div className="card-title">Legend</div>
            <Legend />
          </div>

        </aside>

        {/* ══ MAIN CANVAS ═══════════════════════════════ */}
        <main className="main">

          <div className="graph-card">
            <div className="card-title">
              Graph Visualization —&nbsp;
              {algorithm === 'dijkstra' ? "Dijkstra's Algorithm" : 'A* Search'}
            </div>

            <GraphCanvas
              matrix={matrix}
              positions={positions}
              step={currentStep}
              stepIdx={stepIdx}
              result={result}
              source={source}
              target={target}
              algorithm={algorithm}
            />
          </div>

          {result && (
            <PlaybackControls
              playing={playing}
              stepIdx={stepIdx}
              totalSteps={totalSteps}
              speedMs={speedMs}
              onPlay={play}
              onPause={pause}
              onStepBack={stepBack}
              onStepForward={stepForward}
              onJumpStart={jumpStart}
              onJumpEnd={jumpEnd}
              onSpeedChange={setSpeedMs}
            />
          )}
        </main>

        {/* ══ RIGHT SIDEBAR ═════════════════════════════ */}
        <aside className="sidebar-right">

          <div className="step-log-header">
            <div className="card-title" style={{ margin: 0 }}>
              {algorithm === 'dijkstra' ? 'Dijkstra' : 'A*'} — Execution Log
            </div>
          </div>

          <div className="step-log">
            <StepLog
              steps={result?.steps ?? []}
              stepIdx={stepIdx}
              onSelect={(i) => { pause(); setStepIdx(i) }}
            />
          </div>

          <DistTable
            step={currentStep}
            stepIdx={stepIdx}
            result={result}
            n={matrix.length}
            source={source}
            target={target}
            algorithm={algorithm}
          />

        </aside>

      </div>
    </div>
  )
}