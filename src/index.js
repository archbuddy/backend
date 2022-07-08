require('dotenv').config()
const log = require('./util/logger')
const fastify = require('fastify')({ logger: false })

const { connectMongo, disconnectMongo } = require('./repository/db.js')
const { setup, setupRegisters, setupHooks, setupSchemas, registryCommonRoutes, registrySimpleRoute } = require('./fastify')

// Run the server!
const start = async () => {
  setupRegisters(fastify)
  setupHooks(fastify)
  setupSchemas(fastify)

  registryCommonRoutes(fastify, '/entities', require('./route/entity'))
  registryCommonRoutes(fastify, '/relations', require('./route/relation'))
  registryCommonRoutes(fastify, '/diagrams', require('./route/diagram'))
  registryCommonRoutes(fastify, '/edges', require('./route/edge'))
  registryCommonRoutes(fastify, '/nodes', require('./route/node'))
  
  registrySimpleRoute(fastify, '/healthcheck', require('./route/health').check, 'GET')
  registrySimpleRoute(fastify, '/healthcheck/complete', require('./route/health').complete, 'GET')
  registrySimpleRoute(fastify, '/diagrams/:id/reactflow', require('./route/diagram').reactFlow, 'GET')
  registrySimpleRoute(fastify, '/authentication/google', require('./route/auth').authentication, 'POST')
  registrySimpleRoute(fastify, '/authentication/providers', require('./route/auth').providers, 'GET')
  
  await fastify.ready()
  try {
    log.info('Connecting to mongo')
    await connectMongo()
    const port = 3000
    log.info(`Starting server on port ${port}`)
    await fastify.listen({ port })
    log.info('Server Started')
  } catch (err) {
    await disconnectMongo()
    log.error(err)
    log.error(err.message)
    process.exit(1)
  }
}

start()
