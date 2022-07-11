const { diagramItemModel } = require('../model/diagramItem')
const commonController = require('./commonController.js')

/**
 * List diagram Item
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function list (request, reply) {
  return commonController.list(diagramItemModel(), request, reply)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function byId (request, reply) {
  return commonController.byId(diagramItemModel(), request, reply)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function create (request, reply) {
  return commonController.create(diagramItemModel(), request, reply)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function update (request, reply) {
  return commonController.update(diagramItemModel(), request, reply)
}

/**
 *
 * @description https://www.rfc-editor.org/info/rfc7396
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function partialUpdate (request, reply) {
  return commonController.partialUpdate(diagramItemModel(), request, reply)
}

/**
 *
 * @description https://www.rfc-editor.org/info/rfc7396
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function deleteById (request, reply) {
  return commonController.deleteById(diagramItemModel(), request, reply)
}

module.exports = { list, byId, create, update, partialUpdate, deleteById }
