const { tagModel } = require('../model/tag')
const commonController = require('./commonController.js')

/**
 * List entities
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function list (request, reply) {
  return commonController.list(tagModel(), request, reply)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function byId (request, reply) {
  return commonController.byId(tagModel(), request, reply)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function create (request, reply) {
  const result = await tagModel().find(
    {
      name: new RegExp(`^${request.body.name.trim()}$`, 'i'),
      type: request.body.type
    }
  )
  if (result.length > 0) {
    return reply.code(409).send(result[0].toObject())
  }
  return commonController.create(tagModel(), request, reply)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function update (request, reply) {
  return commonController.update(tagModel(), request, reply)
}

/**
 *
 * @description https://www.rfc-editor.org/info/rfc7396
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function partialUpdate (request, reply) {
  return commonController.partialUpdate(tagModel(), request, reply)
}

/**
 *
 * @description https://www.rfc-editor.org/info/rfc7396
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function deleteById (request, reply) {
  return commonController.deleteById(tagModel(), request, reply)
}

module.exports = { list, byId, create, update, partialUpdate, deleteById }
