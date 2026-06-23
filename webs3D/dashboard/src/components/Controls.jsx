import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function RippleButton({ onClick, children, style, active }) {
  const [ripples, setRipples] = useState([]);

  function handleClick(e) {
    const id = Date.now();
    setRipples(r => [...r, id]);
    setTimeout(() => setRipples(r => r.filter(x => x !== id)), 600);
    onClick?.();
  }

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'relative', overflow: 'hidden',
        background: active ? 'var(--teal)' : 'var(--surface2)',
        border: `1px solid ${active ? 'var(--teal)' : 'var(--border)'}`,
        color: active ? '#000' : 'var(--text)',
        padding: '5px 14px',
        borderRadius: 4,
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.08em',
        transition: 'background 0.15s, color 0.15s',
        ...style,
      }}
    >
      {children}
      {ripples.map(id => (
        <motion.span
          key={id}
          style={{
            position: 'absolute', borderRadius: '50%',
            background: 'rgba(255,255,255,0.3)',
            width: 80, height: 80,
            top: '50%', left: '50%',
            x: '-50%', y: '-50%',
            pointerEvents: 'none',
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      ))}
    </button>
  );
}

export default function Controls({ simRef, onZoomToFit }) {
  const [paused, setPaused]   = useState(false);
  const [speed,  setSpeed]    = useState(1);
  const [stats,  setStats]    = useState({ agents: 0, orbs: 0, time: 0 });

  useEffect(() => {
    const id = setInterval(() => {
      if (!simRef.current) return;
      const { sim } = simRef.current;
      const agentStates = Object.values(sim.agents).map(a => a.state);
      setStats({
        working: agentStates.filter(s => s === 'working').length,
        moving:  agentStates.filter(s => s === 'moving').length,
        done:    agentStates.filter(s => s === 'done').length,
        orbs:    sim.orbs.length,
        time:    sim.time,
      });
    }, 200);
    return () => clearInterval(id);
  }, []);

  function togglePause() {
    if (!simRef.current) return;
    const next = !paused;
    simRef.current.sim.paused = next;
    setPaused(next);
  }

  function handleSpeed(v) {
    const next = parseFloat(v);
    if (simRef.current) simRef.current.sim.speed = next;
    setSpeed(next);
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '6px 14px',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0,
    }}>
      {/* Title */}
      <div style={{ display: 'flex', flexDirection: 'column', marginRight: 8 }}>
        <span style={{ color: 'var(--teal)', fontWeight: 700, fontSize: 13, letterSpacing: '0.1em' }}>
          AI AGENT DASHBOARD
        </span>
        <span style={{ color: 'var(--text-dim)', fontSize: 9 }}>
          3D Pipeline Orchestration
        </span>
      </div>

      {/* Separator */}
      <div style={{ width: 1, height: 30, background: 'var(--border)' }} />

      {/* Pause */}
      <RippleButton onClick={togglePause} active={paused}>
        {paused ? '▶ RESUME' : '⏸ PAUSE'}
      </RippleButton>

      {/* Zoom to fit */}
      <RippleButton onClick={onZoomToFit}>
        ⊡ FIT
      </RippleButton>

      {/* Speed slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: 'var(--text-dim)', fontSize: 10 }}>SPEED</span>
        <input
          type="range" min="0.2" max="4" step="0.1"
          value={speed}
          onChange={e => handleSpeed(e.target.value)}
          style={{ width: 90, accentColor: 'var(--teal)', cursor: 'pointer' }}
        />
        <span style={{ color: 'var(--text)', minWidth: 28, textAlign: 'right' }}>
          {speed.toFixed(1)}×
        </span>
      </div>

      {/* Separator */}
      <div style={{ width: 1, height: 30, background: 'var(--border)', marginLeft: 4 }} />

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginLeft: 4 }}>
        <Stat label="WORKING" value={stats.working ?? 0} color="var(--teal)" />
        <Stat label="MOVING"  value={stats.moving  ?? 0} color="#60A5FA" />
        <Stat label="DONE"    value={stats.done    ?? 0} color="var(--green)" />
        <Stat label="ORBS"    value={stats.orbs    ?? 0} color="var(--amber)" />
        <Stat label="T+"      value={`${(stats.time ?? 0).toFixed(1)}s`} color="var(--text-dim)" />
      </div>

      {/* Pause overlay indicator */}
      <AnimatePresence>
        {paused && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              marginLeft: 'auto',
              background: 'rgba(239,200,68,0.15)',
              border: '1px solid #F59E0B',
              color: '#F59E0B',
              padding: '3px 10px',
              borderRadius: 4,
              fontWeight: 700,
              letterSpacing: '0.1em',
              fontSize: 10,
            }}
          >
            ⏸ PAUSED
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span style={{ color, fontWeight: 700, fontSize: 14 }}>{value}</span>
      <span style={{ color: 'var(--text-dim)', fontSize: 8, letterSpacing: '0.05em' }}>{label}</span>
    </div>
  );
}
