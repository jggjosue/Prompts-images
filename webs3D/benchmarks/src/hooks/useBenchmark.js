import { useState, useCallback, useRef } from 'react'
import { AI_MODELS, simulateModelResponse } from '../data/models'

export function useBenchmark() {
  const [phase, setPhase] = useState('idle') // idle | launching | processing | complete
  const [results, setResults] = useState([])
  const [history, setHistory] = useState([])
  const [activeModels, setActiveModels] = useState({})
  const [orbsFlying, setOrbsFlying] = useState(false)
  const [selectedModel, setSelectedModel] = useState(null)
  const [timelineIndex, setTimelineIndex] = useState(null)
  const timerRef = useRef(null)

  const runBenchmark = useCallback((prompt) => {
    if (!prompt.trim() || phase === 'processing') return

    setPhase('launching')
    setResults([])
    setActiveModels({})
    setOrbsFlying(true)

    setTimeout(() => {
      setPhase('processing')
      setOrbsFlying(false)

      const modelResults = []
      AI_MODELS.forEach((model, i) => {
        const result = simulateModelResponse(model.id)
        setTimeout(() => {
          setActiveModels(prev => ({ ...prev, [model.id]: 'activating' }))
          setTimeout(() => {
            setActiveModels(prev => ({ ...prev, [model.id]: 'complete' }))
            modelResults.push(result)
            setResults(prev => {
              const next = [...prev, result].sort((a, b) => {
                const scoreA = (a.quality * 0.6) + ((1 / a.responseTime) * 40000)
                const scoreB = (b.quality * 0.6) + ((1 / b.responseTime) * 40000)
                return scoreB - scoreA
              })
              return next
            })
            if (modelResults.length === AI_MODELS.length) {
              setPhase('complete')
              setHistory(prev => {
                const entry = {
                  id: Date.now(),
                  prompt,
                  results: [...modelResults],
                  timestamp: new Date().toISOString(),
                }
                return [entry, ...prev].slice(0, 10)
              })
            }
          }, result.responseTime)
        }, i * 300)
      })
    }, 1200)
  }, [phase])

  const reset = useCallback(() => {
    setPhase('idle')
    setResults([])
    setActiveModels({})
    setOrbsFlying(false)
    setSelectedModel(null)
  }, [])

  const displayResults = timelineIndex !== null && history[timelineIndex]
    ? history[timelineIndex].results
    : results

  return {
    phase,
    results: displayResults,
    liveResults: results,
    history,
    activeModels,
    orbsFlying,
    selectedModel,
    setSelectedModel,
    timelineIndex,
    setTimelineIndex,
    runBenchmark,
    reset,
  }
}
