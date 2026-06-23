import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AGENTS_CONFIG, STATE_COLORS, TASK_DESCRIPTIONS } from '../data/config';

const agentMeta = Object.fromEntries(AGENTS_CONFIG.map(a => [a.id, a]));

function StatusDot({ state }) {
  return (
    <motion.div
      style={{
        width: 8, height: 8, borderRadius: '50%',
        background: STATE_COLORS[state] || '#4B5563',
        flexShrink: 0,
      }}
      animate={state === 'working' ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : {}}
      transition={{ duration: 1, repeat: Infinity }}
    />
  );
}

function AgentCard({ agentId, simRef, isSelected, onClick }) {
  const [data, setData] = useState(null);
  const meta = agentMeta[agentId];

  useEffect(() => {
    let raf;
    function update() {
      if (simRef.current) {
        const agent = simRef.current.sim.agents[agentId];
        if (agent) {
          const nodeId = agent.route[Math.max(agent.routeIndex, 0)];
          const pct = agent.workDuration > 0
            ? Math.min(agent.workTimer / agent.workDuration, 1) * 100
            : 0;
          setData({ state: agent.state, nodeId, pct, routeIndex: agent.routeIndex });
        }
      }
      raf = requestAnimationFrame(update);
    }
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [agentId]);

  if (!data) return null;

  return (
    <motion.div
      onClick={() => onClick(agentId)}
      layout
      style={{
        padding: '8px 10px',
        borderRadius: 6,
        border: `1px solid ${isSelected ? meta.color : 'var(--border)'}`,
        background: isSelected ? `${meta.color}12` : 'var(--surface2)',
        cursor: 'pointer',
        marginBottom: 6,
      }}
      whileHover={{ borderColor: meta.color }}
      transition={{ duration: 0.15 }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <StatusDot state={data.state} />
        <span style={{ color: meta.color, fontWeight: 700, fontSize: 12 }}>{meta.name}</span>
        <span style={{
          marginLeft: 'auto', fontSize: 9,
          color: STATE_COLORS[data.state],
          fontWeight: 700, letterSpacing: '0.05em',
        }}>
          {data.state.toUpperCase()}
        </span>
      </div>

      {/* Task */}
      <div style={{ color: 'var(--text-dim)', fontSize: 9, marginBottom: 6, lineHeight: 1.5 }}>
        {data.nodeId ? (TASK_DESCRIPTIONS[data.nodeId] || data.nodeId) : 'Waiting...'}
      </div>

      {/* Progress bar */}
      {data.state === 'working' && (
        <div style={{ height: 2, background: 'var(--border)', borderRadius: 1 }}>
          <motion.div
            style={{ height: '100%', background: meta.color, borderRadius: 1 }}
            animate={{ width: `${data.pct}%` }}
            transition={{ duration: 0.2, ease: 'linear' }}
          />
        </div>
      )}

      {/* Route */}
      <div style={{ display: 'flex', gap: 3, marginTop: 6, flexWrap: 'wrap' }}>
        {meta.route.map((nodeId, i) => (
          <span key={nodeId} style={{
            fontSize: 8,
            padding: '1px 5px',
            borderRadius: 3,
            background: i < data.routeIndex
              ? `${meta.color}33`
              : i === data.routeIndex
              ? meta.color
              : 'var(--border)',
            color: i === data.routeIndex ? '#000' : i < data.routeIndex ? meta.color : 'var(--text-dim)',
            fontWeight: i === data.routeIndex ? 700 : 400,
          }}>
            {nodeId.toUpperCase()}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function AgentPanel({ simRef, selectedAgent, onSelect }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--surface)',
      borderLeft: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '6px 10px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <span style={{ color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em' }}>
          AGENTS
        </span>
        <span style={{ color: 'var(--text-dim)', fontSize: 9, marginLeft: 8 }}>
          click to inspect
        </span>
      </div>

      {/* Cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px 0' }}>
        {AGENTS_CONFIG.map(cfg => (
          <AgentCard
            key={cfg.id}
            agentId={cfg.id}
            simRef={simRef}
            isSelected={selectedAgent === cfg.id}
            onClick={onSelect}
          />
        ))}
      </div>

      {/* Click hint */}
      {!selectedAgent && (
        <div style={{
          padding: '6px 10px',
          color: 'var(--text-dim)',
          fontSize: 9,
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
        }}>
          Click a card or 3D bot to view logs
        </div>
      )}
    </div>
  );
}
