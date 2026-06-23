import { useRef, useMemo, useEffect, createContext, useContext, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import { Vector3, Color } from 'three';
import { createSimulation } from '../simulation/engine';
import { NODES, EDGES, AGENTS_CONFIG, STATE_COLORS } from '../data/config';

const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));

// ─── Simulation context ───────────────────────────────────────────────────────
const SimCtx = createContext(null);
function useSimCtx() { return useContext(SimCtx); }

// ─── Platform node ────────────────────────────────────────────────────────────
function Platform({ node }) {
  const meshRef  = useRef();
  const glowRef  = useRef();
  const { sim } = useSimCtx();

  useFrame(() => {
    const agents = Object.values(sim.agents);
    const working = agents.some(
      a => a.state === 'working' && a.route[a.routeIndex] === node.id
    );
    const done = agents.some(
      a => a.state === 'done' && a.route[a.route.length - 1] === node.id
    );
    const error = agents.some(
      a => a.state === 'error' && a.route[a.routeIndex] === node.id
    );

    const target = done ? '#22C55E' : error ? '#EF4444' : working ? '#14B8A6' : '#1E293B';
    if (meshRef.current) {
      meshRef.current.material.emissive.lerp(new Color(target), 0.08);
      meshRef.current.material.emissiveIntensity = working || done || error ? 0.35 : 0.05;
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = working ? 0.12 + Math.sin(Date.now() * 0.003) * 0.06 : 0.04;
    }
  });

  return (
    <group position={[node.x, 0, node.z]}>
      {/* Platform base */}
      <mesh ref={meshRef} position={[0, node.height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[node.size, node.height, node.size]} />
        <meshStandardMaterial
          color="#0D1825"
          emissive="#14B8A6"
          emissiveIntensity={0.05}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      {/* Top face highlight */}
      <mesh position={[0, node.height + 0.01, 0]}>
        <boxGeometry args={[node.size, 0.02, node.size]} />
        <meshStandardMaterial color="#14B8A6" emissive="#14B8A6" emissiveIntensity={0.3} metalness={1} roughness={0.1} />
      </mesh>
      {/* Glow halo */}
      <mesh ref={glowRef} position={[0, node.height + 0.02, 0]}>
        <boxGeometry args={[node.size + 0.6, 0.01, node.size + 0.6]} />
        <meshBasicMaterial color="#14B8A6" transparent opacity={0.04} />
      </mesh>
      {/* Label */}
      <Text
        position={[0, node.height + 0.5, 0]}
        fontSize={0.22}
        color="#94A3B8"
        anchorX="center"
        anchorY="bottom"
        font={undefined}
        letterSpacing={0.08}
      >
        {node.label}
      </Text>
    </group>
  );
}

// ─── Paths between nodes ──────────────────────────────────────────────────────
function Paths() {
  const lines = useMemo(() => {
    return EDGES.map(({ from, to }) => {
      const a = nodeMap[from];
      const b = nodeMap[to];
      if (!a || !b) return null;
      const points = [
        new Vector3(a.x, a.height + 0.05, a.z),
        new Vector3(b.x, b.height + 0.05, b.z),
      ];
      return { key: `${from}-${to}`, points };
    }).filter(Boolean);
  }, []);

  return (
    <>
      {lines.map(({ key, points }) => (
        <Line key={key} points={points} color="#1E3A5F" lineWidth={1.2} />
      ))}
    </>
  );
}

// ─── Agent bot ────────────────────────────────────────────────────────────────
function AgentBot({ agentId, onHover, onClick, selectedId }) {
  const meshRef  = useRef();
  const ringRef  = useRef();
  const { sim } = useSimCtx();
  const agent    = sim.agents[agentId];

  useFrame((_, delta) => {
    const a = sim.agents[agentId];
    if (!meshRef.current || !a) return;

    // Smooth position
    meshRef.current.position.lerp(a.pos, 0.12);

    // Shake on error
    if (a.shake > 0) {
      meshRef.current.position.x += Math.sin(Date.now() * 0.04) * a.shake * 0.08;
    }

    // Working: rotate
    if (a.state === 'working') {
      meshRef.current.rotation.y += delta * 1.5;
    }

    // Pulse ring
    if (ringRef.current) {
      const pulse = 1 + Math.sin(Date.now() * 0.004) * 0.15;
      ringRef.current.scale.setScalar(a.state === 'working' ? pulse : 1);
      ringRef.current.material.opacity = a.state === 'idle' ? 0 : 0.5;
    }

    // Emissive by state
    const targetHex = STATE_COLORS[a.state] || '#4B5563';
    if (meshRef.current.material) {
      meshRef.current.material.emissive.lerp(new Color(targetHex), 0.1);
      meshRef.current.material.emissiveIntensity = a.state === 'working' ? 0.7 : 0.3;
    }
  });

  const selected = selectedId === agentId;

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[agent.pos.x, agent.pos.y, agent.pos.z]}
        onClick={() => onClick(agentId)}
        onPointerOver={() => onHover(agentId)}
        onPointerOut={() => onHover(null)}
      >
        <capsuleGeometry args={[0.22, 0.4, 4, 8]} />
        <meshStandardMaterial
          color={agent.color}
          emissive={agent.color}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Selection / pulse ring */}
      <mesh ref={ringRef} position={[agent.pos.x, agent.pos.y - 0.15, agent.pos.z]}>
        <torusGeometry args={[0.35, 0.03, 8, 24]} />
        <meshBasicMaterial color={selected ? '#FFFFFF' : agent.color} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// ─── Particles at working agents ──────────────────────────────────────────────
function WorkParticles() {
  const { sim } = useSimCtx();
  const particlesRef = useRef([]);
  const meshRefs = useRef([]);

  const MAX = 40;
  const positions = useMemo(() => new Float32Array(MAX * 3), []);

  useFrame((_, delta) => {
    // Gather working agents
    const working = Object.values(sim.agents).filter(a => a.state === 'working');

    // Update particle positions
    for (let i = 0; i < MAX; i++) {
      const p = particlesRef.current[i];
      if (!p) {
        // Spawn from a random working agent
        if (working.length === 0) {
          positions[i * 3]     = 999;
          positions[i * 3 + 1] = 999;
          positions[i * 3 + 2] = 999;
          continue;
        }
        const agent = working[Math.floor(Math.random() * working.length)];
        particlesRef.current[i] = {
          x: agent.pos.x,
          y: agent.pos.y,
          z: agent.pos.z,
          vx: (Math.random() - 0.5) * 0.6,
          vy: Math.random() * 0.8 + 0.2,
          vz: (Math.random() - 0.5) * 0.6,
          life: 1.0,
        };
        continue; // p local var still null; skip update this frame
      }
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.z += p.vz * delta;
      p.vy -= delta * 0.4;
      p.life -= delta * 1.2;

      if (p.life <= 0) {
        particlesRef.current[i] = null;
        positions[i * 3]     = 999;
        positions[i * 3 + 1] = 999;
        positions[i * 3 + 2] = 999;
      } else {
        positions[i * 3]     = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
      }
    }

    // Push to geometry
    const geom = meshRefs.current?.geometry;
    if (geom?.attributes?.position) geom.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRefs}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={MAX}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#14B8A6"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Data orb ─────────────────────────────────────────────────────────────────
function DataOrb({ orbId }) {
  const meshRef  = useRef();
  const { sim } = useSimCtx();

  useFrame(() => {
    const orb = sim.orbs.find(o => o.id === orbId);
    if (!orb || !meshRef.current) return;
    const pos = orb.curve.getPoint(Math.min(orb.t, 1));
    meshRef.current.position.copy(pos);
    meshRef.current.material.opacity = orb.t > 0.85 ? (1 - orb.t) / 0.15 : 1;
  });

  const orb = sim.orbs.find(o => o.id === orbId);
  if (!orb) return null;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[orb.radius, 8, 8]} />
      <meshStandardMaterial
        color={orb.color}
        emissive={orb.color}
        emissiveIntensity={1.2}
        transparent
        opacity={1}
        metalness={0}
        roughness={0}
      />
    </mesh>
  );
}

// ─── Orb manager (renders dynamic set of orbs) ────────────────────────────────
function OrbManager() {
  const { sim } = useSimCtx();
  const [orbIds, setOrbIds] = useState([]);

  useFrame(() => {
    const currentIds = sim.orbs.map(o => o.id);
    setOrbIds(prev => {
      if (
        prev.length === currentIds.length &&
        prev.every((id, i) => id === currentIds[i])
      ) return prev;
      return [...currentIds];
    });
  });

  return (
    <>
      {orbIds.map(id => <DataOrb key={id} orbId={id} />)}
    </>
  );
}

// ─── Camera controller ────────────────────────────────────────────────────────
function CameraRig({ targetAgent, zoomToFitTrigger }) {
  const controlsRef = useRef();
  const { camera }  = useThree();
  const { sim }     = useSimCtx();

  // Zoom-to-fit
  useEffect(() => {
    if (!zoomToFitTrigger) return;
    camera.position.set(20, 18, 20);
    camera.zoom = 45;
    camera.updateProjectionMatrix();
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [zoomToFitTrigger]);

  // Zoom to selected agent
  useEffect(() => {
    if (!targetAgent) return;
    const agent = sim.agents[targetAgent];
    if (!agent) return;
    if (controlsRef.current) {
      controlsRef.current.target.set(agent.pos.x, agent.pos.y, agent.pos.z);
      controlsRef.current.update();
    }
  }, [targetAgent]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan
      enableZoom
      enableRotate
      minZoom={20}
      maxZoom={120}
      dampingFactor={0.08}
      enableDamping
    />
  );
}

// ─── Tooltip overlay ──────────────────────────────────────────────────────────
function HoverTooltip({ agentId, simRef }) {
  const [snap, setSnap] = useState(null);

  useEffect(() => {
    if (!agentId) { setSnap(null); return; }
    let raf;
    function tick() {
      if (simRef.current) {
        const agent = simRef.current.sim.agents[agentId];
        if (agent) {
          const nodeId = agent.route[Math.max(agent.routeIndex, 0)];
          const pct = agent.workDuration > 0
            ? Math.min(agent.workTimer / agent.workDuration * 100, 100).toFixed(0)
            : 0;
          setSnap({ state: agent.state, nodeId, pct, color: agent.color, name: agent.name });
        }
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [agentId]);

  if (!agentId || !snap) return null;

  return (
    <div style={{
      position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
      background: 'rgba(10,14,20,0.92)', border: '1px solid var(--teal)',
      padding: '8px 14px', borderRadius: 6, pointerEvents: 'none',
      display: 'flex', gap: 12, alignItems: 'center', zIndex: 10,
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: snap.color }} />
      <span style={{ color: snap.color, fontWeight: 700 }}>{snap.name}</span>
      <span style={{ color: 'var(--text-dim)' }}>
        {snap.state === 'working' ? `${snap.nodeId?.toUpperCase()} — ${snap.pct}%` : snap.state.toUpperCase()}
      </span>
      {snap.state === 'working' && (
        <div style={{ width: 80, height: 3, background: 'var(--border)', borderRadius: 2 }}>
          <div style={{ width: `${snap.pct}%`, height: '100%', background: snap.color, borderRadius: 2 }} />
        </div>
      )}
    </div>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
export default function Pipeline3D({ onHover, onSelect, selectedAgent, hoveredAgent, targetAgent, zoomToFitTrigger, simRef }) {
  const internalSimRef = useRef(null);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        orthographic
        camera={{ position: [20, 18, 20], zoom: 45, near: -200, far: 1000 }}
        shadows
        style={{ background: '#0A0E14' }}
      >
        <SceneWithRef simRef={simRef || internalSimRef} onHover={onHover} onSelect={onSelect}
          selectedAgent={selectedAgent} targetAgent={targetAgent} zoomToFitTrigger={zoomToFitTrigger} />
      </Canvas>
      <HoverTooltip agentId={hoveredAgent} simRef={simRef || internalSimRef} />
    </div>
  );
}

function SceneWithRef({ simRef, ...props }) {
  const engineRef = useRef(null);
  if (!engineRef.current) {
    engineRef.current = createSimulation();
  }
  // Expose sim to parent via simRef
  if (simRef) simRef.current = engineRef.current;

  const { sim, tick } = engineRef.current;

  useFrame((_, delta) => tick(delta));

  return (
    <SimCtx.Provider value={{ sim }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={1.0} castShadow />
      <directionalLight position={[-5, 8, -8]} intensity={0.3} color="#6366F1" />
      <pointLight position={[0, 4, 0]} intensity={0.5} color="#14B8A6" distance={20} />

      <gridHelper args={[30, 30, '#0F2030', '#0D1A28']} position={[0, 0, 0]} />

      {NODES.map(node => <Platform key={node.id} node={node} />)}
      <Paths />
      {AGENTS_CONFIG.map(cfg => (
        <AgentBot key={cfg.id} agentId={cfg.id}
          onHover={props.onHover} onClick={props.onSelect} selectedId={props.selectedAgent} />
      ))}
      <OrbManager />
      <WorkParticles />
      <CameraRig targetAgent={props.targetAgent} zoomToFitTrigger={props.zoomToFitTrigger} />
    </SimCtx.Provider>
  );
}
