const repo = require('../repository/db')
const validateViewPoint = require('../model/viewPoint')

async function list () {
  return repo.getViewPoints()
}

async function create (name) {
  await repo.createViewPoint(name)
}

async function associate (viewPoint) {
  const errors = []

  validateViewPoint(viewPoint)

  if (validateViewPoint.errors && validateViewPoint.errors.length > 0) {
    throw new Error(JSON.stringify(validateViewPoint.errors))
  }

  for (const id of viewPoint.nodes) {
    const exists = await repo.nodeExists(id)
    if (!exists) {
      errors.push(`Node id ${id} do not exists`)
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
    const err = Error('Payload is invalid')
    err.data = errors
    throw err
  }

  await repo.updateViewPoint(viewPoint)
}

module.exports = {
  list,
  create,
  associate
}
