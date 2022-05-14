const { NotFound } = require('http-errors')
const Page = require('../util/page.js')
const { uuid: uuidv4 } = require('uuidv4')
const { buildQuery } = require('../util/fiqlQueryBuilder.js')
/**
 * List Entity
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function list (model, request, reply) {
  const query = buildQuery(model, request.query)

  let entities
  let count
  const entitiesPromise = query.exec().then((e) => {
    entities = e
  })
  // @TODO Count only entities on filter
  const countPromise = model
    .count({})
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
    count
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
  const result = await model.findOne({ id: request.params.id })

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
  const id = uuidv4()
  await model.insertMany([
    { ...request.body, id, includedAt: new Date(), updatedAt: new Date() }
  ])
  reply.code(201).header('Location', `${request.routerPath}/${id}`).send()
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function update (model, request, reply) {
  const entity = request.body
  delete entity.updatedAt
  delete entity.includedAt
  delete entity.id

  const result = await model.updateOne(
    { id: request.params.id },
    { ...entity, id: request.params.id, updatedAt: new Date() }
  )

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
  const entity = request.body
  delete entity.updatedAt
  delete entity.includedAt
  delete entity.id

  const result = await model.updateOne(
    { id: request.params.id },
    { ...entity, id: request.params.id, updatedAt: new Date() }
  )

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
  const result = await model.deleteOne({ id: request.params.id })

  if (result.deletedCount <= 0) {
    throw new NotFound('Entity not found')
  }
  reply.code(204).send()
}

module.exports = { list, byId, create, update, partialUpdate, deleteById }