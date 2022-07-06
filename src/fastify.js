const fastifySwagger = require('@fastify/swagger')
const fastifyHelmet = require('@fastify/helmet')
const { getOpenApiDefinition } = require('./swagger.js')
const log = require('./util/logger')

const setupRegisters = (fastify) => {
  log.info('[Fastify] Register Helmet')
  fastify.register(fastifyHelmet)

  const cors = {
    origin: process.env.CORS_ORIGIN ?? true
  }
  log.info(`[Fastify] Setup Cors > ${JSON.stringify(cors)}`)
  fastify.register(require('@fastify/cors'), cors)

  log.info('[Fastify] Register OpenApi')
  fastify.register(fastifySwagger, getOpenApiDefinition())

  log.info('[Fastify] Register JWT')
  fastify.register(require('@fastify/jwt'), {
    secret: process.env.AUTH_JWT_SECRET
  })
}

const setupHooks = (fastify) => {
  log.info('[Fastify] Add Hook onRequest')
  fastify.addHook('onRequest', (req, reply, done) => {
    log.info({ url: req.raw.url, id: req.id, startTime: Date.now(), method: req.method })
    done()
  })

  log.info('[Fastify] Add hook preHandler')
  fastify.addHook('preHandler', async (req, reply) => {
    log.debug('Start authentication validation')

    if (
      req.raw.url.indexOf('/doc') === 0 ||
        req.raw.url.indexOf('/authentication') === 0 ||
        req.raw.url.indexOf('/favicon.ico') === 0) {
      return
    }

    if (!req.headers.authorization) {
      log.error('Header authorization is missing')
      reply.code(401).send()
    }

    try {
      log.debug('will validate JWT')
      await req.jwtVerify()
      log.debug('End authentication validation')
    } catch (err) {
      log.error('Invalid auth')
      reply.code(401).send()
    }
  })
}

const setupSchemas = (fastify) => {
  log.info('[Fastify] Add Schema - Entity')
  fastify.addSchema(require('./schema/entity.js').entitySchema)
  log.info('[Fastify] Add Schema - Relation')
  fastify.addSchema(require('./schema/relation.js').relationSchema)
  log.info('[Fastify] Add Schema - Diagram')
  fastify.addSchema(require('./schema/diagram.js').diagramSchema)
  log.info('[Fastify] Add Schema - DiagramItem')
  fastify.addSchema(require('./schema/diagramItem.js').diagramItemSchema)
  log.info('[Fastify] Add Schema - Edge')
  fastify.addSchema(require('./schema/edge.js').edgeSchema)
  log.info('[Fastify] Add Schema - Node')
  fastify.addSchema(require('./schema/node.js').nodeSchema)
}

const registryCommonRoutes = (app, routePrefix, route) => {
  log.info(`[Fastify] Register Route - ${routePrefix} - and common http methods`)
  app.get(routePrefix, route.list)
  app.post(routePrefix, route.create)
  app.get(`${routePrefix}/:id`, route.byId)
  app.put(`${routePrefix}/:id`, route.update)
  app.patch(`${routePrefix}/:id`, route.partialUpdate)
  app.delete(`${routePrefix}/:id`, route.deleteById)
}

const registrySimpleRoute = (app, routePrefix, route, method) => {
  log.info(`[Fastify] Register Route - ${routePrefix} - Method: ${method}`)
  switch (method) {
    case 'GET': {
      app.get(routePrefix, route)
      break
    }
    case 'POST': {
      app.post(routePrefix, route)
      break
    }
    default: {
      throw new Error(`Invalid method ${method}`)
    }
  }
}

module.exports = {
  setupRegisters,
  setupHooks,
  setupSchemas,
  registryCommonRoutes,
  registrySimpleRoute
}
