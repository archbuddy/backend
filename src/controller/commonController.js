const { NotFound } = require('http-errors')
const Page = require('../util/page.js')
const { v4: uuidv4 } = require('uuid')
const { buildQuery } = require('../util/fiqlQueryBuilder.js')
/**
 * List Entity
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function list (model, request, reply) {
  const q = buildQuery(model, request.query)

  let entities
  let count
  const entitiesPromise = q.pageQuery.exec().then((e) => {
    entities = e
  })
  // @TODO Count only entities on filter
  const countPromise = q.countQuery
    .exec()
    .then((c) => {
      count = c
    })

  await Promise.all([entitiesPromise, countPromise])

  const page = new Page(
    request.routerPath,
    entities,
    request.query.offset,
    request.query.limit,
    count[0]?.count ?? count
  )

  return reply
    .code(200)
    .send(
      page.getJson()
    )
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function byId (model, request, reply) {
  await validateParamsId(request, reply)

  const query = { _id: request.params.id }
  const result = await model.findOne(query)

  if (!result) {
    throw new NotFound('Entity not found')
  }

  reply.code(200).send(result)
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function create (model, request, reply) {
  const _id = request.body._id ?? uuidv4()
  const data = { ...request.body, _id, includedAt: new Date(), updatedAt: new Date() }
  await model.insertMany([
    data
  ])
  reply.code(201).header('Location', `${request.routerPath}/${_id}`).send()
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function update (model, request, reply) {
  await validateParamsId(request, reply)

  const entity = request.body
  delete entity.updatedAt
  delete entity._id

  const query = { _id: request.params.id }
  const data = { ...entity, _id: request.params.id, updatedAt: new Date() }
  const result = await model.updateOne(query, data)

  if (result.modifiedCount <= 0) {
    throw new NotFound('Entity not found')
  }

  reply.code(204).send()
}

/**
 *
 * @description https://www.rfc-editor.org/info/rfc7396
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function partialUpdate (model, request, reply) {
  await validateParamsId(request, reply)

  const entity = request.body
  delete entity.updatedAt
  delete entity._id

  const query = { _id: request.params.id }
  const data = { ...entity, _id: request.params.id, updatedAt: new Date() }
  const result = await model.updateOne(query, data)

  if (result.modifiedCount <= 0) {
    throw new NotFound('Entity not found')
  }
  reply.code(204).send()
}

/**
 *
 * @description https://www.rfc-editor.org/info/rfc7396
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function deleteById (model, request, reply) {
  await validateParamsId(request, reply)

  const result = await model.deleteOne({ _id: request.params.id })

  if (result.deletedCount <= 0) {
    throw new NotFound('Entity not found')
  }
  reply.code(204).send()
}

/**
 *
 * @description https://www.rfc-editor.org/info/rfc7396
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function validateParamsId (request, reply) {
  if(request.params.id && ( request.params.id === undefined || request.params.id === "undefined" )) {
    reply.code(400).send({
      message: 'ID is undefined'
    })
  }
}

module.exports = { list, byId, create, update, partialUpdate, deleteById }
