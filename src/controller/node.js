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

  let entityId = request.body.entity.id
  if (entityId === undefined) {
    const entity = await entityModel().create({
      name: request.body.entity.name,
      description: request.body.entity.description,
      type: request.body.entity.type,
      variant: request.body.variant
    })
    entityId = entity._id
  }

  // TODO check if this relation exists
  const node = {
    x: request.body.x,
    y: request.body.y,
    variant: request.body.variant,
    entity: entityId,
    diagram: request.body.diagram
  }
  const data = await nodeModel().insertMany(node)

  reply.code(201).header('Location', `${request.routerPath}/${data._id}`).send({ id: data._id })
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
  return commonController.partialUpdate(nodeModel(), request, reply)
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
