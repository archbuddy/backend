const log = require('../util/log')

const fastify = require('fastify')({ log: false })
const fastifySwagger = require('@fastify/swagger')
const fastifyHelmet = require('@fastify/helmet')
const { getOpenapiDefinition } = require('./swagger.js')

const healthRoute = require('./route/health')
const diagramRoute = require('./route/diagram')
const edgeRoute = require('./route/edge')
const entityRoute = require('./route/entity')
const nodeRoute = require('./route/node')
const relationRoute = require('./route/relation')
const authRoute = require('./route/auth')

const registryCommonRoutes = (app, routePrefix, route) => {
  log.info(`[Fastify] Register Route - ${routePrefix} - and common http methods`)
  app.get(routePrefix, route.list)
  app.post(routePrefix, route.create)
  app.get(`${routePrefix}/:id`, route.byId)
  app.put(`${routePrefix}/:id`, route.update)
  app.patch(`${routePrefix}/:id`, route.partialUpdate)
  app.delete(`${routePrefix}/:id`, route.deleteById)
}

const build = async () => {
  log.info('[Fastify] Register Helmet')
  fastify.register(fastifyHelmet)

  log.info('[Fastify] Set error handler')
  fastify.setErrorHandler(function (error, _request, reply) {
    log.error(`Generic error handler. Message: ${error.message}`)
    log.error(error.stack)
    reply.status(500).send(
      {
        statusCode: 500,
        message: 'Generic error',
        detail: error.message,
        type: 'https://archbuddy.github.io/documentation/commonErrors',
        instance: ''
      }
    )
  })
  
  const cors = {
    origin: process.env.CORS_ORIGIN ?? true
  }
  log.info(`[Fastify] Setup Cors > ${JSON.stringify(cors)}`)
  fastify.register(require('@fastify/cors'), cors)

  log.info('[Fastify] Register Openapi')
  fastify.register(fastifySwagger, getOpenapiDefinition())
  fastify.register(require('@fastify/jwt'), {
    secret: process.env.AUTH_JWT_SECRET
  })

  log.info('[Fastify] Add Hook onRequest')
  fastify.addHook('onRequest', (req, _reply, done) => {
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

    if (process.env.DISABLE_AUTH === 'true') {
      log.error('Bypassing authentication')
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

  log.info('[Fastify] Register Route - /healthcheck')
  fastify.get('/healthcheck', healthRoute.check)
  log.info('[Fastify] Register Route - /healthcheck/complete')
  fastify.get('/healthcheck/complete', healthRoute.complete)

  registryCommonRoutes(fastify, '/diagrams', diagramRoute)
  registryCommonRoutes(fastify, '/edges', edgeRoute)
  registryCommonRoutes(fastify, '/entities', entityRoute)
  registryCommonRoutes(fastify, '/nodes', nodeRoute)
  registryCommonRoutes(fastify, '/relations', relationRoute)

  log.info('[Fastify] Register Route - /diagrams/:id/reactflow')
  fastify.get('/diagrams/:id/reactflow', diagramRoute.reactFlow)
  log.info('[Fastify] Register Route - /authentication/google')
  fastify.post('/authentication/google', authRoute.authentication)
  log.info('[Fastify] Register Route - /authentication/providers')
  fastify.get('/authentication/providers', authRoute.providers)

  return fastify
}

module.exports = build
