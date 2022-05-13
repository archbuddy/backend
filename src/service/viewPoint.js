const repo = require('../repository/db')
const validateViewPoint = require('../model/viewPoint')
const srvEdges = require('./edges')
const srvNodes = require('./nodes')

async function list () {
  return repo.getViewPoints()
}

async function get (id) {
  const vp = await repo.viewPointExists(id)
  if (vp === undefined) {
    throw new Error(`View point with id ${id} not found`)
  }
  return {
    nodes: await srvNodes.filterNodes(vp.nodes),
    edges: await srvEdges.filterEdges(vp.edges)
  }
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

  const dbData = await repo.viewPointExists(viewPoint.id)
  if (!dbData) {
    throw new Error(`View point ${viewPoint.id} do not exists`)
  }

  for (const item of viewPoint.nodes) {
    const exists = await repo.nodeExists(item.id)
    if (!exists) {
      errors.push(`Node id ${item.id} do not exists`)
    }
  }
  if (viewPoint.edges) {
    for (const id of viewPoint.edges) {
      const exists = await repo.edgeExists(id)
      if (!exists) {
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
