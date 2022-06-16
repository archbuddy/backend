const { entityModel } = require('../model/entity')
const commonController = require('./commonController.js')

/**
 * List entities
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function list (request, reply) {
  return commonController.list(entityModel(), request, reply)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function byId (request, reply) {
  return commonController.byId(entityModel(), request, reply)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function create (request, reply) {
  // Check if there a entity with the same name
  const searchResult = await entityModel().find({ name: request.body.name}).exec()
  if (searchResult !== undefined && searchResult.length > 0) {
    return reply
      .code(400)
      .send(
        commonController.prepareErrorResponse(
          400,
          'Object already exists on database',
          `The entity you are trying to create already exists with the name ${request.body.name}`,
          undefined,
          undefined
        )
      )
  }
  // if not create it
  return commonController.create(entityModel(), request, reply)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function update (request, reply) {
  return commonController.update(entityModel(), request, reply)
}

/**
 *
 * @description https://www.rfc-editor.org/info/rfc7396
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function partialUpdate (request, reply) {
  return commonController.partialUpdate(entityModel(), request, reply)
}

/**
 *
 * @description https://www.rfc-editor.org/info/rfc7396
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function deleteById (request, reply) {
  return commonController.deleteById(entityModel(), request, reply)
}

module.exports = { list, byId, create, update, partialUpdate, deleteById }
