const { edgeModel } = require('../model/edge')
const { relationModel } = require('../model/relation')
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
  // get source and target and create a relation first
  // get its id and associate with the edgeModel
  const relation = {
    description: '',
    detail: '',
    source: request.body.source,
    target: request.body.target
  }
  const relationDbResult = await relationModel().create(relation)
  const edge = {
    sourceHandle: request.body.sourceHandle,
    targetHandle: request.body.targetHandle,
    relation: relationDbResult._id,
    diagram: request.body.diagram
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
