import { useState } from 'react'
import { motion } from 'framer-motion'
import { BENCHMARK_PROMPTS } from '../data/models'

export default function BenchmarkInput({ onRun, phase, onReset }) {
  const [selected, setSelected] = useState('coding')
  const [custom, setCustom] = useState('')

  const prompt = selected === 'custom'
    ? custom
    : BENCHMARK_PROMPTS.find(p => p.id === selected)?.prompt || ''

  const isRunning = phase === 'launching' || phase === 'processing'

  return (
    <div className="bench-input">
      <div className="bench-input__header">
        <span className="bench-badge">BENCHMARK ARENA</span>
        <span className="bench-subtitle">AI Model Competition</span>
      </div>

      <div className="bench-input__presets">
        {BENCHMARK_PROMPTS.map(p => (
          <button
            key={p.id}
            className={`preset-btn ${selected === p.id ? 'preset-btn--active' : ''}`}
            onClick={() => setSelected(p.id)}
            disabled={isRunning}
          >
            {p.label}
          </button>
        ))}
      </div>

      {selected === 'custom' && (
        <textarea
          className="bench-input__textarea"
          placeholder="Enter your custom prompt..."
          value={custom}
          onChange={e => setCustom(e.target.value)}
          rows={3}
        />
      )}

      {selected !== 'custom' && (
        <div className="bench-input__preview">
          {prompt}
        </div>
      )}

      <div className="bench-input__actions">
        {phase === 'complete' ? (
          <motion.button
            className="bench-btn bench-btn--reset"
            onClick={onReset}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            ↺ New Benchmark
          </motion.button>
        ) : (
          <motion.button
            className="bench-btn bench-btn--run"
            onClick={() => onRun(prompt)}
            disabled={isRunning || !prompt.trim()}
            whileHover={!isRunning ? { scale: 1.03 } : {}}
            whileTap={!isRunning ? { scale: 0.97 } : {}}
          >
            {phase === 'launching' ? (
              <><span className="spinner" /> Launching...</>
            ) : phase === 'processing' ? (
              <><span className="spinner" /> Running...</>
            ) : (
              '⚡ Run Benchmark'
            )}
          </motion.button>
        )}
      </div>
    </div>
  )
}
