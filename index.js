// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
const nodes = require('./src/nodes')
const edges = require('./src/edges')

fastify.register(require('@fastify/cors'), { 
  // put your options here
  origin: true
})

fastify.get('/healthcheck', async (request, reply) => {
  return { status: 'OK' }
})

fastify.get('/', async (request, reply) => {
  return { nodes, edges}
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