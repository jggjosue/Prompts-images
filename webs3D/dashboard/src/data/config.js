export const NODES = [
  { id: 'input',     label: 'DATA INPUT',  x: -7, z: 0,   height: 0.4, size: 2.5 },
  { id: 'parse',     label: 'PARSER',      x: -3, z: -3,  height: 0.7, size: 2.2 },
  { id: 'analyze',   label: 'ANALYZER',    x:  1, z:  0,  height: 1.2, size: 3.0 },
  { id: 'validate',  label: 'VALIDATE',    x:  5, z: -2,  height: 0.6, size: 2.2 },
  { id: 'transform', label: 'TRANSFORM',   x: -1, z:  4,  height: 0.9, size: 2.5 },
  { id: 'output',    label: 'OUTPUT',      x:  7, z:  2,  height: 0.5, size: 2.8 },
];

export const EDGES = [
  { from: 'input',     to: 'parse' },
  { from: 'parse',     to: 'analyze' },
  { from: 'analyze',   to: 'transform' },
  { from: 'analyze',   to: 'validate' },
  { from: 'transform', to: 'output' },
  { from: 'validate',  to: 'output' },
];

export const AGENTS_CONFIG = [
  {
    id: 'aria', name: 'ARIA', color: '#14B8A6',
    route: ['input', 'parse', 'analyze', 'transform', 'output'],
    startDelay: 0,
    workTimes: { input: 2.0, parse: 2.5, analyze: 3.5, transform: 2.0, output: 1.5 },
  },
  {
    id: 'nova', name: 'NOVA', color: '#8B5CF6',
    route: ['input', 'parse', 'validate', 'output'],
    startDelay: 1.8,
    workTimes: { input: 1.5, parse: 2.0, validate: 3.0, output: 1.2 },
  },
  {
    id: 'rex', name: 'REX', color: '#F59E0B',
    route: ['input', 'analyze', 'transform', 'output'],
    startDelay: 3.2,
    workTimes: { input: 1.8, analyze: 2.8, transform: 2.2, output: 1.0 },
  },
  {
    id: 'zed', name: 'ZED', color: '#EF4444',
    route: ['input', 'parse', 'analyze', 'validate', 'output'],
    startDelay: 0.5,
    workTimes: { input: 1.2, parse: 2.2, analyze: 3.0, validate: 2.0, output: 1.0 },
  },
];

export const DATA_TYPE_COLORS = {
  text:  '#60A5FA',
  json:  '#34D399',
  image: '#F472B6',
  code:  '#FBBF24',
};

export const ORB_DATA_TYPES = ['text', 'json', 'code', 'image'];

export const TASK_DESCRIPTIONS = {
  input:     'Ingesting raw data stream from upstream sources',
  parse:     'Parsing and tokenizing incoming schema',
  analyze:   'Running semantic analysis and feature extraction',
  transform: 'Transforming payload to target format',
  validate:  'Validating output against schema constraints',
  output:    'Publishing processed results to downstream',
};

export const STATE_COLORS = {
  idle:    '#4B5563',
  moving:  '#1D4ED8',
  working: '#14B8A6',
  error:   '#EF4444',
  done:    '#22C55E',
};
