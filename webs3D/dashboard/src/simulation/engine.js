import { Vector3, CatmullRomCurve3 } from 'three';
import {
  NODES, AGENTS_CONFIG, ORB_DATA_TYPES, DATA_TYPE_COLORS, TASK_DESCRIPTIONS,
} from '../data/config';

const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));

function nodeTop(node) {
  return new Vector3(node.x, node.height + 0.15, node.z);
}

let orbCounter = 0;

export function createSimulation() {
  const sim = {
    time: 0,
    paused: false,
    speed: 1,
    agents: {},
    orbs: [],
    logs: [],
    ganttTasks: [],
    version: 0, // incremented each tick for UI to detect changes
  };

  AGENTS_CONFIG.forEach(cfg => {
    const startNode = nodeMap[cfg.route[0]];
    sim.agents[cfg.id] = {
      id: cfg.id,
      name: cfg.name,
      color: cfg.color,
      route: cfg.route,
      startDelay: cfg.startDelay,
      workTimes: cfg.workTimes,
      routeIndex: -1,
      state: 'idle',
      pos: nodeTop(startNode).clone(),
      targetPos: nodeTop(startNode).clone(),
      workTimer: 0,
      workDuration: 0,
      restartTimer: 0,
      shake: 0,
      logs: [],
    };
  });

  function pushLog(agentId, message, type) {
    const entry = { id: orbCounter++, agentId, message, type, time: sim.time };
    sim.logs.unshift(entry);
    sim.agents[agentId].logs.unshift(entry);
    if (sim.logs.length > 300) sim.logs.length = 300;
    if (sim.agents[agentId].logs.length > 60) sim.agents[agentId].logs.length = 60;
  }

  function spawnOrb(agent, fromId, toId) {
    const from = nodeMap[fromId];
    const to   = nodeMap[toId];
    if (!from || !to) return;

    const dataType = ORB_DATA_TYPES[Math.floor(Math.random() * ORB_DATA_TYPES.length)];
    const sizeKB   = Math.floor(Math.random() * 900 + 100);

    const a = nodeTop(from);
    const b = nodeTop(to);
    const mid = a.clone().lerp(b, 0.5).add(new Vector3(0, 2.5, 0));
    const curve = new CatmullRomCurve3([a, mid, b]);

    sim.orbs.push({
      id: orbCounter++,
      curve,
      t: 0,
      color: DATA_TYPE_COLORS[dataType],
      dataType,
      sizeKB,
      radius: 0.1 + (sizeKB / 1000) * 0.18,
      agentColor: agent.color,
    });

    pushLog(agent.id, `⬡ Emitting ${dataType} payload (${sizeKB}KB)`, 'data');
  }

  function startWork(agent) {
    const nodeId = agent.route[agent.routeIndex];
    agent.state = 'working';
    agent.workTimer = 0;
    agent.workDuration = agent.workTimes[nodeId] || 2;

    sim.ganttTasks.push({
      id: orbCounter++,
      agentId: agent.id,
      nodeId,
      label: TASK_DESCRIPTIONS[nodeId] || nodeId,
      startTime: sim.time,
      endTime: null,
      color: agent.color,
    });

    pushLog(agent.id, `⚙ Processing at ${nodeId.toUpperCase()}`, 'working');
  }

  function tickAgent(agent, dt) {
    if (agent.state === 'done') {
      agent.restartTimer += dt;
      if (agent.restartTimer > 6) {
        agent.routeIndex = -1;
        agent.state = 'idle';
        agent.restartTimer = 0;
        const startNode = nodeMap[agent.route[0]];
        agent.pos.copy(nodeTop(startNode));
        agent.targetPos.copy(nodeTop(startNode));
        pushLog(agent.id, `↺ Restarting pipeline`, 'info');
      }
      return;
    }

    if (sim.time < agent.startDelay) return;

    if (agent.state === 'idle') {
      agent.routeIndex = 0;
      const node = nodeMap[agent.route[0]];
      agent.pos.copy(nodeTop(node));
      pushLog(agent.id, `→ Starting pipeline at ${agent.route[0].toUpperCase()}`, 'start');
      startWork(agent);
      return;
    }

    if (agent.shake > 0) {
      agent.shake = Math.max(0, agent.shake - dt * 3);
    }

    if (agent.state === 'working' || agent.state === 'error') {
      agent.workTimer += dt;

      if (agent.workTimer >= agent.workDuration) {
        if (agent.state === 'error') {
          agent.state = 'working';
          agent.workTimer = 0;
          agent.workDuration = agent.workTimes[agent.route[agent.routeIndex]] || 2;
          pushLog(agent.id, `↺ Retry succeeded, resuming`, 'info');
          return;
        }

        const nodeId = agent.route[agent.routeIndex];

        // Close gantt entry
        const entry = sim.ganttTasks.findLast(g =>
          g.agentId === agent.id && g.nodeId === nodeId && g.endTime === null
        );
        if (entry) entry.endTime = sim.time;

        pushLog(agent.id, `✓ Done at ${nodeId.toUpperCase()}`, 'success');

        // 5% error on non-last node
        if (Math.random() < 0.05 && agent.routeIndex < agent.route.length - 1) {
          agent.state = 'error';
          agent.workTimer = 0;
          agent.workDuration = 1.8;
          agent.shake = 1;
          pushLog(agent.id, `✗ Error at ${nodeId.toUpperCase()} — retrying`, 'error');
          return;
        }

        const nextIndex = agent.routeIndex + 1;
        if (nextIndex >= agent.route.length) {
          agent.state = 'done';
          agent.restartTimer = 0;
          pushLog(agent.id, `⬜ Pipeline complete ✓`, 'done');
          return;
        }

        spawnOrb(agent, nodeId, agent.route[nextIndex]);

        const nextNode = nodeMap[agent.route[nextIndex]];
        agent.targetPos.copy(nodeTop(nextNode));
        agent.routeIndex = nextIndex;
        agent.state = 'moving';
        pushLog(agent.id, `⤳ Moving → ${agent.route[nextIndex].toUpperCase()}`, 'move');
      }
    }

    if (agent.state === 'moving') {
      const dist = agent.pos.distanceTo(agent.targetPos);
      if (dist < 0.05) {
        agent.pos.copy(agent.targetPos);
        startWork(agent);
      } else {
        const step = (2 * dt) / dist;
        agent.pos.lerp(agent.targetPos, Math.min(step, 1));
      }
    }
  }

  function tick(rawDt) {
    if (sim.paused) return;
    const dt = Math.min(rawDt, 0.1) * sim.speed;
    sim.time += dt;

    Object.values(sim.agents).forEach(agent => tickAgent(agent, dt));

    sim.orbs = sim.orbs.filter(orb => {
      orb.t += dt * 0.35;
      return orb.t < 1;
    });

    sim.version++;
  }

  return { sim, tick };
}
