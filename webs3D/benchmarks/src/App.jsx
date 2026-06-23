import { Suspense } from 'react'
import Arena3D from './components/Arena3D'
import BenchmarkInput from './components/BenchmarkInput'
import Leaderboard from './components/Leaderboard'
import ModelDetail from './components/ModelDetail'
import Timeline from './components/Timeline'
import { useBenchmark } from './hooks/useBenchmark'

export default function App() {
  const {
    phase,
    results,
    history,
    activeModels,
    orbsFlying,
    selectedModel,
    setSelectedModel,
    timelineIndex,
    setTimelineIndex,
    runBenchmark,
    reset,
  } = useBenchmark()

  return (
    <div className="app">
      <div className="arena-canvas">
        <Suspense fallback={<div className="canvas-loading">Loading 3D Arena...</div>}>
          <Arena3D
            phase={phase}
            activeModels={activeModels}
            results={results}
            orbsFlying={orbsFlying}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
        </Suspense>
      </div>

      <div className="ui-overlay">
        <div className="ui-left">
          <BenchmarkInput
            onRun={runBenchmark}
            phase={phase}
            onReset={reset}
          />
          <Timeline
            history={history}
            timelineIndex={timelineIndex}
            onSelect={setTimelineIndex}
          />
        </div>

        <div className="ui-right">
          <Leaderboard
            results={results}
            phase={phase}
            onSelectModel={setSelectedModel}
            selectedModel={selectedModel}
          />
        </div>

        {selectedModel && (
          <div className="ui-detail">
            <ModelDetail
              modelId={selectedModel}
              results={results}
              onClose={() => setSelectedModel(null)}
            />
          </div>
        )}
      </div>

      <div className="scanline-overlay" />
    </div>
  )
}
