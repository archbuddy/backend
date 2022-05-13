const { getModel } = require('../db/models/node.js')
const {
  list: _list,
  byId: _byId,
  create: _create,
  update: _update,
  partialUpdate: _partialUpdate,
  deleteById: _deleteById
} = require('./commonController.js')

/**
 * List Nodes
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function list (request, reply) {
  return _list(getModel(), request, reply)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function byId (request, reply) {
  return _byId(getModel(), request, reply)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function create (request, reply) {
  return _create(getModel(), request, reply)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function update (request, reply) {
  return _update(getModel(), request, reply)
}

/**
 *
 * @description https://www.rfc-editor.org/info/rfc7396
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function partialUpdate (request, reply) {
  return _partialUpdate(getModel(), request, reply)
}

/**
 *
 * @description https://www.rfc-editor.org/info/rfc7396
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function deleteById (request, reply) {
  return _deleteById(getModel(), request, reply)
}

module.exports = { list, byId, create, update, partialUpdate, deleteById }
