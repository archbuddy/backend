require('dotenv').config()
const fastify = require('fastify')({ logger: true })
const fastifySwagger = require('fastify-swagger')
const fastifyHelmet = require('@fastify/helmet')
const { getOpenapiDefinition, getSchemas } = require('./swagger.js')

const healthRoute = require('./route/health')
const diagramRoute = require('./route/diagram')
const diagramItemRoute = require('./route/diagramItem')
const edgeRoute = require('./route/edge')
const entityRoute = require('./route/entity')
const nodeRoute = require('./route/node')
const relationRoute = require('./route/relation')
const { connectMongo, disconnectMongo } = require('./repository/db.js')

fastify.register(require('@fastify/cors'), {
  // put your options here
  origin: true
})
fastify.register(fastifySwagger, getOpenapiDefinition())
fastify.addSchema(require('./schema/entity.json'))
fastify.addSchema(require('./schema/diagram.json'))
fastify.addSchema(require('./schema/diagramItem.json'))
fastify.addSchema(require('./schema/edge.json'))
fastify.addSchema(require('./schema/node.json'))
fastify.addSchema(require('./schema/relation.json'))

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

fastify.get('/diagramItems', diagramItemRoute.list)
fastify.get('/diagramItems/:id', diagramItemRoute.byId)
fastify.head('/diagramItems/:id', diagramItemRoute.byIdHead)
fastify.delete('/diagramItems/:id', diagramItemRoute.deleteById)

fastify.setErrorHandler(function (error, request, reply) {
  reply.send(error)
})

// Run the server!
const start = async () => {
  await connectMongo()
  try {
    await fastify.listen(3000)
  } catch (err) {
    await disconnectMongo()
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
