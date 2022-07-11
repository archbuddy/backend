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
      200: {
        type: 'object',
        properties: {
          token: {
            type: 'string'
          }
        }
      }
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
      200: { 
        type: "array",
        default: [],
        items: {
          title: "Items",
          type: "object",
          required: [
            "providerId",
            "providerName",
            "config"
          ],
          properties: {
            providerId: {
              type: "string",
            },
            providerName: {
              type: "string",
            },
            config: {
              type: "object",
              required: [
                "id",
                "redirectUrl",
                "endpoint"
              ],
              properties: {
                id: {
                  type: "string",
                },
                redirectUrl: {
                    type: "string",
                },
                endpoint: {
                  type: "string",
                }
              }
            }
          }
        }
      }
    }
  }
}

module.exports = {
  authentication,
  providers
}
