import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AGENTS_CONFIG } from '../data/config';

const agentMeta = Object.fromEntries(AGENTS_CONFIG.map(a => [a.id, { name: a.name, color: a.color }]));

const TYPE_COLORS = {
  start:   '#60A5FA',
  working: '#14B8A6',
  success: '#22C55E',
  error:   '#EF4444',
  move:    '#94A3B8',
  data:    '#FBBF24',
  done:    '#8B5CF6',
  info:    '#64748B',
};

function LogLine({ entry }) {
  const meta = agentMeta[entry.agentId] || { name: entry.agentId, color: '#64748B' };
  const color = TYPE_COLORS[entry.type] || '#CBD5E1';

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 6,
        padding: '2px 8px',
        borderLeft: `2px solid ${entry.type === 'error' ? '#EF4444' : 'transparent'}`,
        background: entry.type === 'error' ? 'rgba(239,68,68,0.05)' : 'transparent',
      }}
    >
      <span style={{ color: 'var(--text-dim)', flexShrink: 0, fontSize: 9, paddingTop: 1 }}>
        {entry.time.toFixed(1)}s
      </span>
      <span style={{
        color: meta.color, fontWeight: 700, flexShrink: 0, fontSize: 9, paddingTop: 1,
        minWidth: 30,
      }}>
        {meta.name}
      </span>
      <span style={{ color, lineHeight: 1.6, wordBreak: 'break-all' }}>
        {entry.message}
      </span>
    </motion.div>
  );
}

export default function LogTerminal({ simRef, selectedAgent }) {
  const [logs, setLogs]       = useState([]);
  const [flash, setFlash]     = useState(false);
  const prevErrCount          = useRef(0);
  const containerRef          = useRef();

  useEffect(() => {
    let raf;
    function update() {
      if (simRef.current) {
        const { sim } = simRef.current;
        const source  = selectedAgent
          ? sim.agents[selectedAgent]?.logs || []
          : sim.logs;
        const slice = source.slice(0, 60);
        setLogs(prev => {
          if (prev.length === slice.length && prev[0]?.id === slice[0]?.id) return prev;
          return slice;
        });

        // Flash on new errors
        const errCount = slice.filter(l => l.type === 'error').length;
        if (errCount > prevErrCount.current) {
          setFlash(true);
          setTimeout(() => setFlash(false), 400);
        }
        prevErrCount.current = errCount;
      }
      raf = requestAnimationFrame(update);
    }
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [selectedAgent]);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: flash ? 'rgba(239,68,68,0.08)' : 'var(--surface)',
      border: `1px solid ${flash ? '#EF444466' : 'var(--border)'}`,
      transition: 'background 0.2s, border-color 0.2s',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '4px 10px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 6,
        flexShrink: 0,
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#22C55E',
          boxShadow: '0 0 6px #22C55E',
          animation: 'pulse 2s infinite',
        }} />
        <span style={{ color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em' }}>
          {selectedAgent ? `${agentMeta[selectedAgent]?.name} LOG` : 'SYSTEM LOG'}
        </span>
        <span style={{ color: 'var(--text-dim)', fontSize: 9, marginLeft: 'auto' }}>
          {logs.length} entries
        </span>
      </div>

      {/* Logs */}
      <div ref={containerRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <AnimatePresence initial={false}>
          {logs.map(entry => (
            <LogLine key={entry.id} entry={entry} />
          ))}
        </AnimatePresence>
        {logs.length === 0 && (
          <div style={{ color: 'var(--text-dim)', padding: '12px 10px', fontStyle: 'italic' }}>
            Awaiting events...
          </div>
        )}
      </div>
    </div>
  );
}
