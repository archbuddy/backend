const { preHandler, preValidation } = require('./hook/default.js')
const entityController = require('../../services/controller/entity.js')
const { getPageSchema } = require('../swagger.js')
const { entitySchema, entityUpsertSchema } = require('../schema/entity.js')
const { getListSchemaDefaultQueryProperty } = require('./base')

const list = {
  preValidation,
  preHandler,
  handler: entityController.list,
  schema: {
    tags: ['Entity'],
    query: getListSchemaDefaultQueryProperty(),
    response: {
      200: getPageSchema('entity')
    }
  }
}
const byId = {
  preValidation,
  preHandler,
  handler: entityController.byId,
  schema: {
    tags: ['Entity'],
    response: {
      200: { $ref: 'entity' }
    },
    params: {
      type: 'object',
      properties: {
        id: {
          ...entitySchema.properties.id,
          description: 'Id'
        }
      }
    }
  }
}
const byIdHead = {
  preValidation,
  preHandler,
  handler: entityController.byId,
  schema: {
    tags: ['Entity'],
    response: {
      200: { type: 'null' }
    },
    params: {
      type: 'object',
      properties: {
        id: {
          ...entitySchema.properties.id,
          description: 'Id'

        }
      }
    }
  }
}
const create = {
  preValidation,
  preHandler,
  handler: entityController.create,
  schema: {
    tags: ['Entity'],
    body: entityUpsertSchema,
    response: {
      201: {
        description: 'Successfully created item',
        type: 'null',
        headers: {
          Location: {
            type: 'string',
            description: 'Location of the new Entity'
          }
        }
      }
    }
  }
}
const update = {
  preValidation,
  preHandler,
  handler: entityController.update,
  schema: {
    tags: ['Entity'],
    body: entityUpsertSchema,
    response: {
      204: {
        description: 'Successfully updated item',
        type: 'null'
      }
    },
    params: {
      type: 'object',
      properties: {
        id: {
          ...entitySchema.properties.id,
          description: 'Id'

        }
      }
    }
  }
}
const partialUpdate = {
  preValidation,
  preHandler,
  handler: entityController.partialUpdate,
  schema: {
    tags: ['Entity'],
    body: {
      type: 'object',
      properties: entityUpsertSchema.properties
    },
    response: {
      204: {
        description: 'Successfully updated item',
        type: 'null'
      }
    },
    params: {
      type: 'object',
      properties: {
        id: {
          ...entitySchema.properties.id,
          description: 'Id'

        }
      }
    }
  }
}
const deleteById = {
  preValidation,
  preHandler,
  handler: entityController.deleteById,
  schema: {
    tags: ['Entity'],
    response: {
      200: {
        description: 'Successfully deleted item',
        type: 'null'
      }
    },
    params: {
      type: 'object',
      properties: {
        id: {
          ...entitySchema.properties.id,
          description: 'Id'

        }
      }
    }
  }
}

module.exports = {
  list,
  byId,
  byIdHead,
  create,
  update,
  partialUpdate,
  deleteById
}
