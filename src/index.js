require('dotenv').config()
const fastify = require('fastify')({ logger: true })
const serviceEdge = require('./service/edges')
const serviceNode = require('./service/nodes')
const serviceViewPoint = require('./service/viewPoint')

fastify.register(require('@fastify/cors'), {
  // put your options here
  origin: true
})

fastify.get('/healthcheck', async (request, reply) => {
  fastify.log.info('healthcheck')
  return { status: 'OK' }
})

fastify.get('/', async (request, reply) => {
  return { nodes: await serviceNode.getNodes(), edges: await serviceEdge.getEdges() }
})

fastify.post('/system', async (request, reply) => {
  await serviceNode.addNode(request.body)
  return { }
})

fastify.patch('/system', async (request, reply) => {
  await serviceNode.patchNode(request.body)
  return { }
})

fastify.post('/edge', async (request, reply) => {
  await serviceEdge.addEdge(request.body)
  return { }
})

fastify.patch('/edge', async (request, reply) => {
  await serviceEdge.patchEdge(request.body)
  return { }
})

fastify.delete('/edge/:id', async (request, reply) => {
  await serviceEdge.deleteEdge(request.params.id)
  return { }
})

fastify.delete('/node/:id', async (request, reply) => {
  await serviceNode.deleteNode(request.params.id)
  return { }
})

fastify.get('/viewpoint/:id', async (request, reply) => {
  const item = await serviceViewPoint.get(request.params.id)
  return item
})

fastify.get('/viewpoint', async (request, reply) => {
  const list = await serviceViewPoint.list()
  return { list }
})

fastify.post('/viewpoint', async (request, reply) => {
  await serviceViewPoint.create(request.body.name)
  return { }
})

fastify.patch('/viewpoint', async (request, reply) => {
  await serviceViewPoint.associate(request.body)
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
