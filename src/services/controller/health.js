const { getPackageInfo } = require('../../util/common')

/**
 * Check the general availability of the application
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
function check (request, reply) {
  return { status: 'ok' }
}

/**
 * Complete analysis of application healthy
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function complete (request, reply) {
  const pkg = getPackageInfo()
  return {
    meta: {
      name: pkg.name,
      description: pkg.description,
      uptime: process.uptime(),
      nodeVersion: process.version
    },
    status: 'ok',
    dependencies: []
  }
}

module.exports = { check, complete }
