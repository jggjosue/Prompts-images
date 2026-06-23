import { motion, AnimatePresence } from 'framer-motion'
import { AI_MODELS } from '../data/models'

const SENTIMENT_COLORS = {
  positive: '#10B981',
  neutral: '#6B7280',
  negative: '#EF4444',
}

function getSentiment(quality) {
  if (quality >= 90) return 'positive'
  if (quality >= 75) return 'neutral'
  return 'negative'
}

export default function ModelDetail({ modelId, results, onClose }) {
  const model = AI_MODELS.find(m => m.id === modelId)
  const result = results.find(r => r.modelId === modelId)

  if (!model) return null

  const sentiment = result ? getSentiment(result.quality) : 'neutral'
  const sentColor = SENTIMENT_COLORS[sentiment]

  return (
    <AnimatePresence>
      {modelId && (
        <motion.div
          className="model-detail"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          style={{ '--accent': model.color }}
        >
          <div className="model-detail__header">
            <div className="model-detail__identity">
              <span className="model-dot" style={{ background: model.color }} />
              <div>
                <div className="model-detail__name">{model.name}</div>
                <div className="model-detail__provider">{model.provider}</div>
              </div>
            </div>
            <button className="model-detail__close" onClick={onClose}>✕</button>
          </div>

          {result ? (
            <>
              <div className="model-detail__aura" style={{ '--sentiment': sentColor }}>
                <span className="aura-label">Sentiment</span>
                <span className="aura-value" style={{ color: sentColor }}>
                  {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                </span>
              </div>

              <div className="model-detail__metrics">
                <MetricRow label="Quality Score" value={`${result.quality.toFixed(1)}`} max={100} color={model.color} />
                <MetricRow label="Response Time" value={`${(result.responseTime / 1000).toFixed(2)}s`} max={3} rawVal={result.responseTime / 1000} color="#3B82F6" invert />
                <MetricRow label="Tokens" value={`${result.tokens}`} max={600} rawVal={result.tokens} color="#8B5CF6" />
                <MetricRow label="Tokens/sec" value={`${result.tokensPerSecond.toFixed(0)}`} max={400} rawVal={result.tokensPerSecond} color="#F59E0B" />
              </div>

              <div className="model-detail__response">
                <div className="response-label">Response Preview</div>
                <div className="response-text">{result.response}</div>
              </div>
            </>
          ) : (
            <div className="model-detail__waiting">
              <div className="pulse-dot" style={{ background: model.color }} />
              Waiting for response...
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function MetricRow({ label, value, max, rawVal, color, invert }) {
  const raw = rawVal !== undefined ? rawVal : parseFloat(value)
  const pct = Math.min(100, (raw / max) * 100)
  const barPct = invert ? 100 - pct : pct

  return (
    <div className="metric-row">
      <div className="metric-row__top">
        <span className="metric-label">{label}</span>
        <span className="metric-value" style={{ color }}>{value}</span>
      </div>
      <div className="metric-bar-bg">
        <motion.div
          className="metric-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${barPct}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
          style={{ background: color }}
        />
      </div>
    </div>
  )
}
