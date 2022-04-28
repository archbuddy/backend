// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

const nodes = require('./src/nodes')
const edges = require('./src/edges')

fastify.register(require('@fastify/cors'), {
  // put your options here
  origin: true
})

fastify.get('/healthcheck', async (request, reply) => {
  fastify.log.info('healthcheck')
  return { status: 'OK' }
})

fastify.get('/', async (request, reply) => {
  return { nodes, edges }
})

fastify.post('/system', async (request, reply) => {
  //dummy implementation
  nodes.push(  {
    id: `n${nodes.length+1}`,
    data: { label: request.body.name },
    position: { x: -30, y: 10 },
    type: 'system'
  })
  return { }
})

fastify.post('/edge', async (request, reply) => {
  const body = request.body
  //dummy implementation
  edges.push({ id: `${body.source}${body.target}`, source: `${body.source}`, sourceHandle: `${body.sourceHandle}`, target: `${body.target}`, targetHandle: `${body.targetHandle}`, label: `${body.label}`})
  return { }
})


fastify.delete('/edge/:id', async (request, reply) => {
  //dummy implementation
  const index = edges.findIndex((obj) => obj.id === request.params.id)
  delete edges[index];
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
