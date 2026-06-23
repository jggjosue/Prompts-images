import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { AI_MODELS } from '../data/models'

function scoreOf(r) {
  return (r.quality * 0.6) + ((1 / r.responseTime) * 40000)
}

export default function Leaderboard({ results, phase, onSelectModel, selectedModel }) {
  const sorted = [...results].sort((a, b) => scoreOf(b) - scoreOf(a))

  if (phase === 'idle' && !results.length) {
    return (
      <div className="leaderboard leaderboard--empty">
        <div className="leaderboard__title">LEADERBOARD</div>
        <div className="leaderboard__placeholder">
          {AI_MODELS.map(m => (
            <div key={m.id} className="leaderboard__idle-row">
              <span className="dot" style={{ background: m.color }} />
              <span>{m.name}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard__title">
        LEADERBOARD
        {phase === 'processing' && <span className="leaderboard__live">● LIVE</span>}
      </div>
      <LayoutGroup>
        <AnimatePresence>
          {sorted.map((result, i) => {
            const model = AI_MODELS.find(m => m.id === result.modelId)
            const score = scoreOf(result)
            const isWinner = i === 0
            const isSelected = selectedModel === result.modelId

            return (
              <motion.div
                key={result.modelId}
                layout
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`leaderboard__row ${isWinner ? 'leaderboard__row--winner' : ''} ${isSelected ? 'leaderboard__row--selected' : ''}`}
                onClick={() => onSelectModel(isSelected ? null : result.modelId)}
                style={{ '--model-color': model.color }}
              >
                <span className="lb-rank">{i + 1}</span>
                <span className="lb-dot" style={{ background: model.color }} />
                <div className="lb-info">
                  <span className="lb-name">{model.name}</span>
                  <span className="lb-provider">{model.provider}</span>
                </div>
                <div className="lb-metrics">
                  <span className="lb-score">{score.toFixed(0)}</span>
                  <div className="lb-bar-wrap">
                    <motion.div
                      className="lb-bar"
                      initial={{ width: 0 }}
                      animate={{ width: `${(score / 200) * 100}%` }}
                      transition={{ type: 'spring', stiffness: 120, damping: 20, delay: i * 0.08 }}
                      style={{ background: model.color }}
                    />
                  </div>
                </div>
                {isWinner && (
                  <motion.span
                    className="lb-crown"
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    👑
                  </motion.span>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  )
}
