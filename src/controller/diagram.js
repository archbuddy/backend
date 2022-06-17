const { diagramModel } = require('../model/diagram')
const commonController = require('./commonController')
const { nodeModel } = require('../model/node')
const { edgeModel } = require('../model/edge')
/**
 * List diagram
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function list (request, reply) {
  return commonController.list(diagramModel(), request, reply)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function byId (request, reply) {
  return commonController.byId(diagramModel(), request, reply)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function create (request, reply) {
  const result = await diagramModel().find(
    { name: new RegExp(`^${request.body.name}$`, 'i') }
  )
  if (result.length > 0) {
    return reply.code(409).send(commonController.prepareResponse(result[0]))
  }
  return commonController.create(diagramModel(), request, reply)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function update (request, reply) {
  return commonController.update(diagramModel(), request, reply)
}

/**
 *
 * @description https://www.rfc-editor.org/info/rfc7396
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function partialUpdate (request, reply) {
  return commonController.partialUpdate(diagramModel(), request, reply)
}

/**
 *
 * @description https://www.rfc-editor.org/info/rfc7396
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function deleteById (request, reply) {
  return commonController.deleteById(diagramModel(), request, reply)
}

/**
 *
 * @description https://www.rfc-editor.org/info/rfc7396
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function reactFlow (request, reply) {
  const diagramId = request.params.id
  const obj = await diagramModel().findOne({ _id: diagramId})
  if (obj === null) {
    return reply.code(404).send(commonController.prepareErrorResponse(
      404,
      'Diagram not found',
      'You are trying to retrieve data from a diagram that doesn\'t exists!',
      undefined,
      undefined
    ))
  }
  const nodes = await nodeModel().find({ diagram: diagramId }).populate('entity').exec()
  const edges = await edgeModel().find({ diagram: diagramId }).populate('relation').exec()
  const reactEdges = await convertEdgeToReactFlow(edges)
  return reply.code(200).send({
    nodes: await convertNodeToReactFlow(nodes),
    edges: await prepareEdges(reactEdges)
  })
}

async function convertEdgeToReactFlow (edges) {
  const newlist = []
  for (const item of edges) {
    newlist.push({
      id: item._id,
      sourceHandle: item.source.handle,
      targetHandle: item.target.handle,
      source: item.source.node,
      target: item.target.node,
      data: {
        description: item.relation.description,
        detail: item.relation.detail
      },
      markerEnd: {
        type: 'arrowclosed'
      },
      relation: item.relation._id
    })
  }
  return newlist
}

async function convertNodeToReactFlow (nodes) {
  const newlist = []
  for (const item of nodes) {
    newlist.push({
      id: item._id,
      position: {
        x: item.x,
        y: item.y
      },
      type: item.entity.type,
      data: {
        entity: item.entity._id,
        name: item.entity.name,
        description: item.entity.description ?? '',
        variant: item.variant ?? 'internal'
      }
    })
  }
  return newlist
}

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
    const obj = JSON.parse(JSON.stringify(list[0]))
    obj.innerList = []
    obj.data = {
      description: '',
      detail: ''
    }
    for (let index = 0; index < list.length; index++) {
      const item = list[index]
      if ((index + 1) === list.length) {
        obj.data.description += item.data.description
        obj.data.detail += item.data.detail
      } else {
        obj.data.description += item.data.description + ', '
        obj.data.detail += item.data.detail + ', '
      }
      obj.innerList.push(item)
    }
    listToReturn.push(obj)
  }

  return listToReturn
}

module.exports = { list, byId, create, update, partialUpdate, deleteById, reactFlow }
