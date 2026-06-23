import { motion } from 'framer-motion'

export default function Timeline({ history, timelineIndex, onSelect }) {
  if (!history.length) return null

  return (
    <div className="timeline">
      <div className="timeline__label">HISTORY</div>
      <div className="timeline__track">
        {history.map((entry, i) => (
          <motion.button
            key={entry.id}
            className={`timeline__node ${timelineIndex === i ? 'timeline__node--active' : ''}`}
            onClick={() => onSelect(timelineIndex === i ? null : i)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            title={new Date(entry.timestamp).toLocaleTimeString()}
          >
            <span className="timeline__dot" />
            <span className="timeline__time">
              {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </motion.button>
        ))}
        {timelineIndex !== null && (
          <button className="timeline__clear" onClick={() => onSelect(null)}>
            Live ↗
          </button>
        )}
      </div>
    </div>
  )
}
