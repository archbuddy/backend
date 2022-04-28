// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
const service = require('./srv')

fastify.register(require('@fastify/cors'), {
  // put your options here
  origin: true
})

fastify.get('/healthcheck', async (request, reply) => {
  fastify.log.info('healthcheck')
  return { status: 'OK' }
})

fastify.get('/', async (request, reply) => {
  return { nodes: await service.getNodes(), edges: await service.getEdges() }
})

fastify.post('/system', async (request, reply) => {
  await service.addNode(request.body)
  return { }
})

fastify.post('/edge', async (request, reply) => {
  await service.addEdge(request.body)
  return { }
})

fastify.delete('/edge/:id', async (request, reply) => {
  await service.deleteEdge(request.params.id)
  return { }
})

fastify.delete('/node/:id', async (request, reply) => {
  await service.deleteNode(request.params.id)
  return { }
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
