const { relationModel } = require('../model/relation')
const commonController = require('./commonController.js')
const log = require('../../util/log')
/**
 * List nodes
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function list (request, reply) {
  return commonController.list(relationModel(), request, reply)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function byId (request, reply) {
  return commonController.byId(relationModel(), request, reply)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function create (request, reply) {
  if (request.body.source === request.body.target) {
    return reply.code(400).send(commonController.prepareErrorResponse(
      400,
      'Source and target are the same',
      'We do not support connection a system to a system, because it not represent a valid connection in the c4model framework',
      undefined,
      undefined
    ))
  }
  return commonController.create(relationModel(), request, reply)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function update (request, reply) {
  return commonController.update(relationModel(), request, reply)
}

/**
 *
 * @description https://www.rfc-editor.org/info/rfc7396
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function partialUpdate (request, reply) {
  return commonController.partialUpdate(relationModel(), request, reply)
}

/**
 *
 * @description https://www.rfc-editor.org/info/rfc7396
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function deleteById (request, reply) {
  return commonController.deleteById(relationModel(), request, reply)
}

/**
 *
 * @description https://www.rfc-editor.org/info/rfc7396
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function listAllConnections (request, reply) {
  const query = [
    {
      $match: {
        source: request.params.source,
        target: request.params.target
      }
    }
  ]
  const filter = request.query.name
  if (filter) {
    query.push({
      $match: {
        $or: [
          {
            description: new RegExp(`.*${filter}.*`, 'i')
          }, {
            detail: new RegExp(`.*${filter}.*`, 'i')
          }
        ]
      }
    })
  }
  log.debug(`Filter relations ${JSON.stringify(query)}`)
  const data = await relationModel().aggregate(query).exec()
  const list = data.map(i => {
    i.id = i._id
    delete i._id
    return i
  })
  return reply.code(200).send(list)
}

module.exports = { list, byId, create, update, partialUpdate, deleteById, listAllConnections }
