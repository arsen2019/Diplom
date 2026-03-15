import { useState, useEffect, useRef, useCallback } from 'react'
import { PLAYBACK } from '../constants/config'

export function usePlayback(result) {
  const [stepIdx,  setStepIdx]  = useState(0)
  const [playing,  setPlaying]  = useState(false)
  const [speedMs,  setSpeedMs]  = useState(PLAYBACK.defaultSpeedMs)
  const intervalRef = useRef(null)

  // Reset when a new result arrives
  useEffect(() => {
    setStepIdx(0)
    setPlaying(false)
  }, [result])

  // Auto-advance
  useEffect(() => {
    clearInterval(intervalRef.current)
    if (!playing || !result) return

    intervalRef.current = setInterval(() => {
      setStepIdx(s => {
        if (s >= result.steps.length - 1) {
          setPlaying(false)
          return s
        }
        return s + 1
      })
    }, speedMs)

    return () => clearInterval(intervalRef.current)
  }, [playing, result, speedMs])

  const totalSteps = result?.steps.length ?? 0

  const play        = useCallback(() => { if (result) setPlaying(true)  }, [result])
  const pause       = useCallback(() => setPlaying(false), [])
  const stepForward = useCallback(() => { setPlaying(false); setStepIdx(s => Math.min(s + 1, totalSteps - 1)) }, [totalSteps])
  const stepBack    = useCallback(() => { setPlaying(false); setStepIdx(s => Math.max(s - 1, 0)) }, [])
  const jumpStart   = useCallback(() => { setPlaying(false); setStepIdx(0) }, [])
  const jumpEnd     = useCallback(() => { setPlaying(false); setStepIdx(Math.max(0, totalSteps - 1)) }, [totalSteps])

  const currentStep = result ? result.steps[stepIdx] : null

  return {
    stepIdx, setStepIdx,
    playing,
    speedMs, setSpeedMs,
    play, pause,
    stepForward, stepBack,
    jumpStart, jumpEnd,
    currentStep,
    totalSteps,
  }
}