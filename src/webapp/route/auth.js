const { preHandler, preValidation } = require('./hook/default.js')
const authController = require('../../services/controller/auth.js')

const authentication = {
  preValidation,
  preHandler,
  handler: authController.authentication,
  schema: {
    query: {
      type: 'object'
    },
    response: {
    }
  }
}

const providers = {
  preValidation,
  preHandler,
  handler: authController.providers,
  schema: {
    query: {
      type: 'object'
    },
    response: {
    }
  }
}

module.exports = {
  authentication,
  providers
}
