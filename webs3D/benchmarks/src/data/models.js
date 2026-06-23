export const AI_MODELS = [
  {
    id: 'gpt4',
    name: 'GPT-4o',
    provider: 'OpenAI',
    color: '#F59E0B',
    geometry: 'icosahedron',
    position: [-4, 0, 0],
    avgSpeed: 1.2,
    avgQuality: 92,
  },
  {
    id: 'claude',
    name: 'Claude 3.5',
    provider: 'Anthropic',
    color: '#C0C0C0',
    geometry: 'sphere',
    position: [0, 0, -4],
    avgSpeed: 1.5,
    avgQuality: 95,
  },
  {
    id: 'gemini',
    name: 'Gemini 1.5',
    provider: 'Google',
    color: '#3B82F6',
    geometry: 'box',
    position: [4, 0, 0],
    avgSpeed: 1.0,
    avgQuality: 88,
  },
  {
    id: 'mistral',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    color: '#8B5CF6',
    geometry: 'octahedron',
    position: [0, 0, 4],
    avgSpeed: 0.8,
    avgQuality: 84,
  },
]

export const BENCHMARK_PROMPTS = [
  { id: 'coding', label: 'Coding Challenge', prompt: 'Write a binary search tree implementation in Python with insert, search, and delete operations.' },
  { id: 'reasoning', label: 'Logic Reasoning', prompt: 'Solve: If all Bloops are Razzles, and all Razzles are Lazzles, are all Bloops definitely Lazzles? Explain step by step.' },
  { id: 'creative', label: 'Creative Writing', prompt: 'Write a 3-paragraph story about a robot discovering emotions for the first time.' },
  { id: 'math', label: 'Math Problem', prompt: 'Solve and explain: A train travels at 60mph for 2 hours, then at 80mph for 3 hours. What is the average speed for the entire trip?' },
  { id: 'custom', label: 'Custom Prompt', prompt: '' },
]

export function simulateModelResponse(modelId) {
  const model = AI_MODELS.find(m => m.id === modelId)
  const baseTime = model.avgSpeed * 1000
  const time = baseTime + (Math.random() - 0.5) * 500
  const quality = model.avgQuality + (Math.random() - 0.5) * 10
  const tokens = Math.floor(200 + Math.random() * 400)

  return {
    modelId,
    responseTime: Math.max(300, time),
    quality: Math.min(100, Math.max(60, quality)),
    tokens,
    tokensPerSecond: tokens / (time / 1000),
    response: generateFakeResponse(modelId),
  }
}

function generateFakeResponse(modelId) {
  const responses = {
    gpt4: "Here's a comprehensive implementation...\n\nThe binary search tree maintains the BST property where left children are smaller and right children are larger than the parent node.",
    claude: "I'll implement this step by step for clarity.\n\nA binary search tree (BST) is a data structure where each node has at most two children, maintaining the invariant that left subtree values are less than the node's value.",
    gemini: "Let me break this down systematically.\n\nBinary search trees enable O(log n) average-case operations. Here's my implementation with all three operations.",
    mistral: "Here's an efficient Python implementation.\n\nThis BST implementation uses a Node class for structure and a BinarySearchTree class to encapsulate the operations.",
  }
  return responses[modelId] || "Processing your request..."
}
