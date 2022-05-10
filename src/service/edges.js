const repo = require('../repository/db')

async function prepareEdges (list) {
  // Identitfy similiar edges
  const map = new Map()
  for (const item of list) {
    const uniqueId = `${item.source}${item.target}${item.sourceHandle}${item.targetHandle}`
    if (map.has(uniqueId)) {
      map.set(map.get(uniqueId).push(item))
    } else {
      map.set(uniqueId, [item])
    }
  }
  const listToReturn = []
  // create a merge edge and external data
  for (const entry of map.entries()) {
    const list = entry[1]
    if (list === undefined) {
      continue
    }
    if (list.length === 1) {
      listToReturn.push(list[0])
    } else {
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
  }

  return listToReturn
}

async function getEdges () {
  if (process.env.MERGE_EDGES === 'true') {
    const list = await prepareEdges(await repo.getEdges())
    return list
  } else {
    return await repo.getEdges()
  }
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

module.exports = {
  getEdges,
  addEdge,
  deleteEdge,
  patchEdge
}
