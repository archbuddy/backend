const repo = require('../repository/db')
const validateViewPoint = require('../model/viewPoint')
const srvEdges = require('./edges')
const srvNodes = require('./nodes')

async function list () {
  return repo.getViewPoints()
}

function getNode (nodes, id) {
  const index = nodes.findIndex((item) => item.id === id)
  return nodes[index]
}

async function get (id) {
  const vp = await repo.getViewPoint(id)
  if (vp === undefined) {
    throw new Error(`View point with id ${id} not found`)
  }
  const obj = {
    nodes: await srvNodes.filterNodes(vp.nodes),
    edges: await srvEdges.filterEdges(vp.edges)
  }
  // TODO rethink logic
  for (const item of obj.nodes) {
    item.position = getNode(vp.nodes, item.id).position
  }
  return obj
}

async function create (name) {
  if (name === undefined || name.trim().length === 0) {
    throw new Error('Body name is required')
  }
  await repo.createViewPoint(name)
}

async function associate (viewPoint) {
  const errors = []

  validateViewPoint(viewPoint)

  if (validateViewPoint.errors && validateViewPoint.errors.length > 0) {
    throw new Error(JSON.stringify(validateViewPoint.errors))
  }

  const dbData = await repo.getViewPoint(viewPoint.id)
  if (!dbData) {
    throw new Error(`View point ${viewPoint.id} do not exists`)
  }

  for (const item of viewPoint.nodes) {
    const node = await repo.getNode(item.id)
    if (!node) {
      errors.push(`Node id ${item.id} do not exists`)
    }
  }
  if (viewPoint.edges) {
    for (const id of viewPoint.edges) {
      const edge = await repo.getEdge(id)
      if (!edge) {
        errors.push(`Edge id ${id} do not exists`)
      }
    }
  }

  if (errors.length > 0) {
    console.log(JSON.stringify(errors))
    const err = Error('Payload is invalid')
    // TODO change fastify error handler to return custom errors when needed
    err.data = errors
    throw err
  }

  await repo.updateViewPoint(viewPoint)
}

module.exports = {
  list,
  create,
  associate,
  get
}
