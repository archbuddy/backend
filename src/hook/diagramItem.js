
async function preHandler (request, reply) {
  // Add here your pre-handle code
  // For example:
  // const hostname = request.body.email.split('@')[1]
  // debug({ hostname })
  // return resolver.resolveMx(hostname).catch((e) => {
  //   throw new createError.BadRequest('invalid email domain')
  // })
}

async function preValidation (request, reply) {
  // Add here your pre-validation code
  // For example:
  // if (!request.headers['x-businessunit']) {
  //   throw new createError.BadRequest('Missing business unit header on request')
  // }
}

module.exports = { preHandler, preValidation }
