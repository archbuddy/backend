const { edgeModel } = require('../model/edge')
const { relationModel } = require('../model/relation')
const { nodeModel } = require('../model/node')
const commonController = require('./commonController.js')

/**
 * List edges
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function list (request, reply) {
  return commonController.list(edgeModel(), request, reply)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function byId (request, reply) {
  return commonController.byId(edgeModel(), request, reply)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function create (request, reply) {
  const edge = {
    source: request.body.source,
    target: request.body.target,
    diagram: request.body.diagram
  }

  if (request.body.relation) {
    edge.relation = request.body.relation
  } else {
    const sourceNode = await nodeModel().findById(request.body.source.node)
    const targetNode = await nodeModel().findById(request.body.target.node)
    const relation = {
      description: 'some new relation',
      detail: 'relation detail',
      source: sourceNode.entity,
      target: targetNode.entity
    }

    const relationDbResult = await relationModel().create(relation)

    edge.relation = relationDbResult._id
  }

  await edgeModel().create(edge)
  reply.status(201).send()
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function update (request, reply) {
  return commonController.update(edgeModel(), request, reply)
}

/**
 *
 * @description https://www.rfc-editor.org/info/rfc7396
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function partialUpdate (request, reply) {
  // TODO I think this operation is invalid for our context
  // Maybe to change the handle? But I think the best option is to delete the edge
  // and recreate it with different handles
  return commonController.partialUpdate(edgeModel(), request, reply)
}

/**
 *
 * @description https://www.rfc-editor.org/info/rfc7396
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function deleteById (request, reply) {
  return commonController.deleteById(edgeModel(), request, reply)
}

module.exports = { list, byId, create, update, partialUpdate, deleteById }
