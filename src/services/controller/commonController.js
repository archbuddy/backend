const Page = require('../util/page.js')
const { buildQuery } = require('../util/fiqlQueryBuilder.js')
const auditController = require('./auditController')
const log = require('../../util/log')
/**
 * List Entity
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function list (model, request, reply) {
  const q = buildQuery(model, request.query)
  log.debug(`Query for ${model.modelName}`)

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

  const list = entities.map(i => i.toObject())

  const page = new Page(
    request.routerPath,
    list,
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
    reply.code(404).send(prepareErrorResponse(
      404,
      'Not found',
      `${model.modelName} id ${request.params.id} not found`,
      undefined,
      undefined
    ))
    return
  }

  reply.code(200).send(result.toObject())
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function create (model, request, reply) {
  const body = { ...request.body, includedAt: new Date(), updatedAt: new Date() }
  const data = await model.create(body)
  await auditController.insert(request, `Model: ${model.modelName}`, data.toObject())
  reply.code(200)
    .header('Location', `${request.routerPath}/${data._id}`)
    .send(data.toObject())
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
  delete entity.id

  const query = { _id: request.params.id }
  const data = { ...entity, _id: request.params.id, updatedAt: new Date() }
  const result = await model.updateOne(query, data)

  if (result.modifiedCount <= 0) {
    reply.code(404).send(prepareErrorResponse(
      404,
      'Not found',
      `${model.modelName} id ${request.params.id} not found`,
      undefined,
      undefined
    ))
    return
  }
  await auditController.update(request, `Model: ${model.modelName}`, data)
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

  const findResult = await model.findOne({ _id: request.params.id })
  if (findResult === null || findResult === undefined) {
    reply.code(404).send(prepareErrorResponse(
      404,
      'Not found',
      `${model.modelName} id ${request.params.id} not found`,
      undefined,
      undefined
    ))
    return
  }
  const body = request.body
  for (const key of Object.keys(body)) {
    findResult[key] = body[key]
  }

  findResult.updatedAt = new Date()
  findResult.save()
  await auditController.update(request, `Model: ${model.modelName} - partial update`, findResult.toObject())
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
    reply.code(404).send(prepareErrorResponse(
      404,
      'Not found',
      `${model.modelName} id ${request.params.id} not found`,
      undefined,
      undefined
    ))
    return
  }
  await auditController.remove(request, `Model: ${model.modelName}`, { id: request.params.id })
  reply.code(204).send()
}

/**
 *
 * @description https://www.rfc-editor.org/info/rfc7396
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function validateParamsId (request, reply) {
  if (request.params.id && (request.params.id === undefined || request.params.id === 'undefined')) {
    reply.code(400).send(prepareErrorResponse(
      400,
      'Invalid ID',
      `The id to execute the operation is invalid. Received: ${request.params.id}`,
      undefined,
      undefined
    ))
  }
}

/**
 * Return a standard message following the RFC 7807
 * @param {*} code Error Code
 * @param {*} message Message from the flow
 * @param {*} error Exception error Object
 * @returns Error message
 */
function prepareErrorResponse (statusCode, message, detail, type, instance) {
  return {
    statusCode,
    message,
    detail,
    type: type ?? 'https://archbuddy.github.io/documentation/commonErrors',
    instance: instance ?? ''
  }
}

module.exports = { list, byId, create, update, partialUpdate, deleteById, prepareErrorResponse, validateParamsId }
