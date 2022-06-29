require('dotenv').config()

const log = require('./util/logger')

const fastify = require('fastify')({ logger: false })
const fastifySwagger = require('@fastify/swagger')
const fastifyHelmet = require('@fastify/helmet')
const { getOpenapiDefinition } = require('./swagger.js')

const healthRoute = require('./route/health')
const diagramRoute = require('./route/diagram')
// const diagramItemRoute = require('./route/diagramItem')
const edgeRoute = require('./route/edge')
const entityRoute = require('./route/entity')
const nodeRoute = require('./route/node')
const relationRoute = require('./route/relation')
const authRoute = require('./route/auth')

const { connectMongo, disconnectMongo } = require('./repository/db.js')

fastify.register(require('@fastify/cors'), {
  // put your options here
  origin: true
})
fastify.register(fastifySwagger, getOpenapiDefinition())
fastify.register(require('fastify-jwt'), {
  secret: 'mysupersecret'
})

fastify.addHook('onRequest', (req, reply, done) => {
  log.info({ url: req.raw.url, id: req.id, startTime: Date.now(), method: req.method })
  done()
})

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

fastify.addSchema(require('./schema/entity.js').entitySchema)
fastify.addSchema(require('./schema/relation.js').relationSchema)
fastify.addSchema(require('./schema/diagram.js').diagramSchema)
fastify.addSchema(require('./schema/diagramItem.js').diagramItemSchema)
fastify.addSchema(require('./schema/edge.js').edgeSchema)
fastify.addSchema(require('./schema/node.js').nodeSchema)

fastify.register(fastifyHelmet)

fastify.get('/healthcheck', healthRoute.check)
fastify.get('/healthcheck/complete', healthRoute.complete)

const registryCommonRoutes = (app, routePrefix, route) => {
  app.get(routePrefix, route.list)
  app.post(routePrefix, route.create)
  app.get(`${routePrefix}/:id`, route.byId)
  app.head(`${routePrefix}/:id`, route.byIdHead)
  app.put(`${routePrefix}/:id`, route.update)
  app.patch(`${routePrefix}/:id`, route.partialUpdate)
  app.delete(`${routePrefix}/:id`, route.deleteById)
}

registryCommonRoutes(fastify, '/diagrams', diagramRoute)
registryCommonRoutes(fastify, '/edges', edgeRoute)
registryCommonRoutes(fastify, '/entities', entityRoute)
registryCommonRoutes(fastify, '/nodes', nodeRoute)
registryCommonRoutes(fastify, '/relations', relationRoute)

// TODO Maybe we don't need this for now
// fastify.get('/diagramItems', diagramItemRoute.list)
// fastify.get('/diagramItems/:id', diagramItemRoute.byId)
// fastify.head('/diagramItems/:id', diagramItemRoute.byIdHead)
// fastify.delete('/diagramItems/:id', diagramItemRoute.deleteById)

fastify.get('/diagrams/:id/reactflow', diagramRoute.reactFlow)
// TODO rename authentication function name to google specific
fastify.post('/authentication/google', authRoute.authentication)
fastify.get('/authentication/providers', authRoute.providers)

fastify.setErrorHandler(function (error, request, reply) {
  const obj = {
    url: request.url,
    method: request.method,
    params: request.params,
    queryString: request.query,
    errorMessage: error.message
  }
  log.error(`Generic error handling >>> ${JSON.stringify(obj)}`)
  reply.send(error)
})

// Run the server!
const start = async () => {
  try {
    await connectMongo()
    const port = 3000
    log.info(`Starting server on port ${port}`)
    await fastify.listen({ port })
    log.info('Started')
  } catch (err) {
    await disconnectMongo()
    log.error(err)
    log.error(err.message)
    process.exit(1)
  }
}

start()
