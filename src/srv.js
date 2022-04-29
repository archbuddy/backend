const edges = [
  { id: 'n1n2', source: 'n1', sourceHandle: 'r1', target: 'n2', targetHandle: 'l1', label: 'authenticate' },
  { id: 'n1n3', source: 'n1', sourceHandle: 'r1', target: 'n3', targetHandle: 'l1', label: 'authenticate' }
]

const nodes = [
  {
    id: 'n1',
    data: { label: 'Arch Buddy' },
    position: { x: -30, y: 10 },
    type: 'system'
  },
  {
    id: 'n2',
    data: { label: 'Microsoft Identity' },
    position: { x: 99, y: -59 },
    type: 'system'
  },
  {
    id: 'n3',
    data: { label: 'Google Authenticator' },
    position: { x: 91, y: 54 },
    type: 'system'
  }
]

async function getNodes () {
  return nodes
}

async function getEdges () {
  return edges
}

async function addNode (body) {
  nodes.push({
    id: `n${nodes.length + 1}`,
    data: { label: body.name },
    position: { x: -30, y: 10 },
    type: 'system'
  })
}

async function addEdge (body) {
  // dummy implementation
  edges.push({ id: `${body.source}${body.target}`, source: `${body.source}`, sourceHandle: `${body.sourceHandle}`, target: `${body.target}`, targetHandle: `${body.targetHandle}`, label: `${body.label}` })
}

async function deleteEdge (id) {
  // dummy implementation
  const index = edges.findIndex((obj) => obj.id === id)
  if (index > -1) {
    edges.splice(index, 1)
  }
}

async function deleteNode (id) {
  // dummy implementation
  let index = -1
  do {
    index = edges.findIndex((obj) => (obj.source === id || obj.target === id))
    if (index > -1) {
      edges.splice(index, 1)
    }
  } while (index > -1)

  index = nodes.findIndex((obj) => obj.id === id)
  if (index > -1) {
    nodes.splice(index, 1)
  }
}

module.exports = {
  getNodes,
  getEdges,
  addEdge,
  addNode,
  deleteEdge,
  deleteNode
}
