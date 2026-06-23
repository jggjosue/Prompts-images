import { useState, useRef, useCallback } from 'react';
import Pipeline3D   from './components/Pipeline3D';
import GanttChart   from './components/GanttChart';
import LogTerminal  from './components/LogTerminal';
import Controls     from './components/Controls';
import AgentPanel   from './components/AgentPanel';

export default function App() {
  const simRef         = useRef(null);
  const [selected, setSelected]   = useState(null);
  const [hovered,  setHovered]    = useState(null);
  const [ganttHover, setGanttHover] = useState(null);
  const [zoomTrig, setZoomTrig]   = useState(0);

  const handleZoomToFit = useCallback(() => setZoomTrig(n => n + 1), []);

  const handleSelect = useCallback((id) => {
    setSelected(prev => prev === id ? null : id);
  }, []);

  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
      gridTemplateColumns: '1fr 220px',
      gridTemplateAreas: `
        "controls  controls"
        "canvas    panel"
        "gantt     logs"
      `,
      background: 'var(--bg)',
      overflow: 'hidden',
    }}>
      {/* Controls bar */}
      <div style={{ gridArea: 'controls' }}>
        <Controls simRef={simRef} onZoomToFit={handleZoomToFit} />
      </div>

      {/* 3D Canvas */}
      <div style={{ gridArea: 'canvas', position: 'relative', minHeight: 0 }}>
        <Pipeline3D
          simRef={simRef}
          selectedAgent={selected}
          hoveredAgent={hovered}
          targetAgent={ganttHover || selected}
          zoomToFitTrigger={zoomTrig}
          onHover={setHovered}
          onSelect={handleSelect}
        />
      </div>

      {/* Agent panel */}
      <div style={{ gridArea: 'panel', minHeight: 0, overflow: 'hidden' }}>
        <AgentPanel
          simRef={simRef}
          selectedAgent={selected}
          onSelect={handleSelect}
        />
      </div>

      {/* Gantt chart */}
      <div style={{ gridArea: 'gantt', height: 130, borderTop: '1px solid var(--border)' }}>
        <GanttChart simRef={simRef} onAgentHover={setGanttHover} />
      </div>

      {/* Log terminal */}
      <div style={{ gridArea: 'logs', height: 130, borderTop: '1px solid var(--border)' }}>
        <LogTerminal simRef={simRef} selectedAgent={selected} />
      </div>
    </div>
  );
}
