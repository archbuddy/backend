const { preHandler, preValidation } = require('./hook/default.js')
const relationController = require('../../services/controller/relation.js')
const { getPageSchema } = require('../swagger.js')
const { relationSchema, relationUpsertSchema } = require('../schema/relation.js')
const { getListSchemaDefaultQueryProperty } = require('./base')

const list = {
  preValidation,
  preHandler,
  handler: relationController.list,
  schema: {
    tags: ['Relation'],
    query: getListSchemaDefaultQueryProperty(),
    response: {
      200: getPageSchema('relation')
    }
  }
}
const byId = {
  preValidation,
  preHandler,
  handler: relationController.byId,
  schema: {
    tags: ['Relation'],
    response: {
      200: { $ref: 'relation' }
    },
    params: {
      type: 'object',
      properties: {
        id: {
          ...relationSchema.properties.id,
          description: 'Id'
        }
      }
    }
  }
}
const byIdHead = {
  preValidation,
  preHandler,
  handler: relationController.byId,
  schema: {
    tags: ['Relation'],
    response: {
      200: { type: 'null' }
    },
    params: {
      type: 'object',
      properties: {
        id: {
          ...relationSchema.properties.id,
          description: 'Id'
        }
      }
    }
  }
}
const create = {
  preValidation,
  preHandler,
  handler: relationController.create,
  schema: {
    tags: ['Relation'],
    body: relationUpsertSchema,
    response: {
      201: {
        description: 'Successfully created item',
        type: 'null',
        headers: {
          Location: {
            type: 'string',
            description: 'Location of the new Relation'
          }
        }
      }
    }
  }
}
const update = {
  preValidation,
  preHandler,
  handler: relationController.update,
  schema: {
    tags: ['Relation'],
    body: relationUpsertSchema,
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
          ...relationSchema.properties.id,
          description: 'Id'
        }
      }
    }
  }
}
const partialUpdate = {
  preValidation,
  preHandler,
  handler: relationController.partialUpdate,
  schema: {
    tags: ['Relation'],
    body: {
      type: 'object',
      properties: relationUpsertSchema.properties
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
          ...relationSchema.properties.id,
          description: 'Id'
        }
      }
    }
  }
}
const deleteById = {
  preValidation,
  preHandler,
  handler: relationController.deleteById,
  schema: {
    tags: ['Relation'],
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
          ...relationSchema.properties.id,
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
