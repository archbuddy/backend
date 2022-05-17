const { nodeModel } = require('../model/node')
const { entityModel } = require('../model/entity')
const commonController = require('./commonController.js')

/**
 * List nodes
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function list (request, reply) {
  return commonController.list(nodeModel(), request, reply)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function byId (request, reply) {
  return commonController.byId(nodeModel(), request, reply)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function create (request, reply) {

  // TODO Check if this is the correct way
  // Create a entity and after create a node in the diagram
  // I tried to use commonController to create the node and entity but the way is implemented is not possible
  // but if you change the uuid generation and do not use request.body it maybe works
  // request from screen {type,name,position,diagramId}
  
  // TODO Check if entity already exists
  const entity = {
    name: request.body.name,
    type: request.body.type
  }
  const entityDbResult = await entityModel().create(entity)
  
  // TODO check if thos relation exists
  const node = {
    x: request.body.x,
    y: request.body.y,
    entity: entityDbResult._id,
    diagram: request.body.diagram
  }
  await nodeModel().insertMany(node)

  reply.code(201).send()
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function update (request, reply) {
  return commonController.update(nodeModel(), request, reply)
}

/**
 *
 * @description https://www.rfc-editor.org/info/rfc7396
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function partialUpdate (request, reply) {
  // the id node that came here is from the entity object that do not match with the local id
  // so update the node considering the diagramId and entityId
  // and update the data
  const entity = request.body
  const query = { 
    entity: request.params.id,
    diagram: request.body.diagram
  }
  const toUpdate = { ...entity, id: request.params.id, updatedAt: new Date() }

  const result = await nodeModel().updateOne(
    query,
    toUpdate
  )

  if (result.modifiedCount <= 0) {
    throw new NotFound('Entity not found')
  }

  reply.status(201).send()
}

/**
 *
 * @description https://www.rfc-editor.org/info/rfc7396
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function deleteById (request, reply) {
  return commonController.deleteById(nodeModel(), request, reply)
}

module.exports = { list, byId, create, update, partialUpdate, deleteById }
