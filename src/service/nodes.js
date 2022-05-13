const repo = require('../repository/db')

async function deleteNode (id) {
  await repo.deleteNode(id)
}

async function patchNode (body) {
  await repo.patchNode(body)
}

async function addNode (body) {
  await repo.addNode(body)
}

async function getNodes () {
  return await repo.getNodes()
}

async function filterNodes (nodeList) {
  return repo.filterNodes(nodeList)
}

module.exports = {
  deleteNode,
  patchNode,
  addNode,
  getNodes,
  filterNodes
}
