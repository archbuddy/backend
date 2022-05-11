const edges = [
  { id: 'n1n2', source: 'n1', sourceHandle: 'r1', target: 'n2', targetHandle: 'l1', label: 'authenticate' },
  { id: 'n1n3', source: 'n1', sourceHandle: 'r1', target: 'n3', targetHandle: 'l1', label: 'authenticate' },
  { id: 'n1n3-1', source: 'n1', sourceHandle: 'r1', target: 'n3', targetHandle: 'l1', label: 'user' }
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

const viewPoints = []

async function getNodes () {
  return nodes
}

async function getEdges () {
  return edges
}

async function getViewPoints () {
  return viewPoints
}

async function addNode (body) {
  nodes.push({
    id: `n${nodes.length + 1}`,
    data: { label: body.name },
    position: { x: -30, y: 10 },
    type: 'system'
  })
}

async function patchNode (body) {
  body.forEach(element => {
    const index = nodes.findIndex((obj) => obj.id === element.id)
    nodes[index].position.x = element.position.x
    nodes[index].position.y = element.position.y
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

async function patchEdge (edge) {
  const index = edges.findIndex((obj) => obj.id === edge.id)
  if (index > -1) {
    edges[index].label = edge.label
  }
}

async function createViewPoint (name) {
  const viewPoint = {}
  viewPoint.id = viewPoints.length + 1
  viewPoint.name = name
  viewPoints.push(viewPoint)
}

async function updateViewPoint (viewPoint) {
  const index = viewPoints.findIndex((obj) => obj.id === viewPoint.id)
  if (index > -1) {
    viewPoints[index] = viewPoint
  }
}

async function edgeExists (id) {
  const index = edges.findIndex((obj) => obj.id === id)
  if (index === -1) {
    return undefined
  }
  return edges[index]
}

async function nodeExists (id) {
  const index = nodes.findIndex((obj) => obj.id === id)
  if (index === -1) {
    return undefined
  }
  return nodes[index]
}

async function viewPointExists (id) {
  const searchId = parseInt(id)
  const index = viewPoints.findIndex((obj) => obj.id === searchId)
  if (index === -1) {
    return undefined
  }
  return viewPoints[index]
}

module.exports = {
  getNodes,
  getEdges,
  addEdge,
  addNode,
  deleteEdge,
  deleteNode,
  patchNode,
  patchEdge,
  getViewPoints,
  createViewPoint,
  updateViewPoint,
  edgeExists,
  nodeExists,
  viewPointExists
}
