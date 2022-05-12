const repo = require('../repository/db')

function getEdgeAsMap (list) {
  const map = new Map()
  for (const item of list) {
    const uniqueId = `${item.source}${item.target}${item.sourceHandle}${item.targetHandle}`
    if (map.has(uniqueId)) {
      map.set(map.get(uniqueId).push(item))
    } else {
      map.set(uniqueId, [item])
    }
  }
  return map
}

async function prepareEdges (edges) {
  // Identitfy similiar edges
  const map = getEdgeAsMap(edges)
  const listToReturn = []
  // create a merge edge and external data
  for (const entry of map.entries()) {
    const list = entry[1]
    if (list === undefined) {
      continue
    }
    if (list.length === 1) {
      listToReturn.push(list[0])
      continue
    }
    const obj = JSON.parse(JSON.stringify(list[0]))
    obj.innerList = []
    obj.label = ''
    for (let index = 0; index < list.length; index++) {
      const item = list[index]
      if ((index + 1) === list.length) {
        obj.label += item.label
      } else {
        obj.label += item.label + ', '
      }
      obj.innerList.push(item)
    }
    listToReturn.push(obj)
  }

  return listToReturn
}

async function getEdges () {
  return filterEdges(undefined)
}

async function addEdge (body) {
  await repo.addEdge(body)
}

async function deleteEdge (id) {
  await repo.deleteEdge(id)
}

async function patchEdge (edge) {
  await repo.patchEdge(edge)
}

async function filterEdges (edgesList) {
  if (process.env.MERGE_EDGES === 'true') {
    if (edgesList) {
      return await prepareEdges(await repo.filterEdges(edgesList))
    } else {
      return await prepareEdges(await repo.getEdges())
    }
  } else {
    if (edgesList) {
      return await repo.filterEdges(edgesList)
    }
    return await repo.getEdges()
  }
  
}

module.exports = {
  getEdges,
  addEdge,
  deleteEdge,
  patchEdge,
  filterEdges
}
