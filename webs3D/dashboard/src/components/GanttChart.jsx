import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AGENTS_CONFIG } from '../data/config';

const AGENT_ORDER = AGENTS_CONFIG.map(a => a.id);
const agentMeta   = Object.fromEntries(AGENTS_CONFIG.map(a => [a.id, { name: a.name, color: a.color }]));

export default function GanttChart({ simRef, onAgentHover }) {
  const [tasks, setTasks]   = useState([]);
  const [simTime, setTime]  = useState(0);
  const animFrame           = useRef();

  useEffect(() => {
    let raf;
    function update() {
      if (simRef.current) {
        const { sim } = simRef.current;
        setTasks([...sim.ganttTasks]);
        setTime(sim.time);
      }
      raf = requestAnimationFrame(update);
    }
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  const windowSec = Math.max(simTime, 20);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '4px 10px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8,
        flexShrink: 0,
      }}>
        <span style={{ color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.1em' }}>
          EXECUTION TIMELINE
        </span>
        <span style={{ color: 'var(--text-dim)', marginLeft: 'auto' }}>
          T+{simTime.toFixed(1)}s
        </span>
      </div>

      {/* Rows */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '4px 0' }}>
        {AGENT_ORDER.map(agentId => {
          const meta  = agentMeta[agentId];
          const myTasks = tasks.filter(t => t.agentId === agentId);

          return (
            <div
              key={agentId}
              style={{ display: 'flex', alignItems: 'center', height: 26, marginBottom: 2 }}
              onMouseEnter={() => onAgentHover && onAgentHover(agentId)}
              onMouseLeave={() => onAgentHover && onAgentHover(null)}
            >
              {/* Agent label */}
              <div style={{
                width: 50, paddingLeft: 10, flexShrink: 0,
                color: meta.color, fontWeight: 700, fontSize: 10,
                letterSpacing: '0.05em',
              }}>
                {meta.name}
              </div>

              {/* Bar area */}
              <div style={{ flex: 1, position: 'relative', height: 18, marginRight: 8 }}>
                {myTasks.map(task => {
                  const startPct = (task.startTime / windowSec) * 100;
                  const endTime  = task.endTime !== null ? task.endTime : simTime;
                  const widthPct = ((endTime - task.startTime) / windowSec) * 100;
                  const isActive = task.endTime === null;

                  return (
                    <motion.div
                      key={task.id}
                      title={task.label}
                      style={{
                        position: 'absolute',
                        left: `${startPct}%`,
                        top: 0,
                        height: '100%',
                        borderRadius: 2,
                        background: isActive
                          ? `${meta.color}CC`
                          : `${meta.color}55`,
                        border: isActive ? `1px solid ${meta.color}` : `1px solid ${meta.color}44`,
                        overflow: 'hidden',
                        cursor: 'default',
                      }}
                      animate={{ width: `${Math.max(widthPct, 0.4)}%` }}
                      transition={{ duration: 0.15, ease: 'linear' }}
                    >
                      {/* Shimmer on active */}
                      {isActive && (
                        <motion.div
                          style={{
                            position: 'absolute', inset: 0,
                            background: `linear-gradient(90deg, transparent, ${meta.color}40, transparent)`,
                          }}
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        />
                      )}
                    </motion.div>
                  );
                })}

                {/* Time cursor */}
                <div style={{
                  position: 'absolute',
                  left: `${(simTime / windowSec) * 100}%`,
                  top: -2, bottom: -2,
                  width: 1,
                  background: 'var(--teal)',
                  opacity: 0.4,
                  pointerEvents: 'none',
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Time axis */}
      <div style={{
        display: 'flex', paddingLeft: 50, paddingRight: 8,
        paddingBottom: 3, flexShrink: 0,
      }}>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} style={{
            flex: 1,
            color: 'var(--text-dim)',
            fontSize: 9,
            borderLeft: '1px solid var(--border)',
            paddingLeft: 3,
          }}>
            {((windowSec / 5) * i).toFixed(0)}s
          </div>
        ))}
      </div>
    </div>
  );
}
