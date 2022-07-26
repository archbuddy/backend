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
const listAllConnections = {
  preValidation,
  preHandler,
  handler: relationController.listAllConnections,
  schema: {
    tags: ['Relation'],
    params: {
      type: 'object',
      properties: {
        source: {
          type: 'string',
          format: 'uuid',
          description: 'Source of the relation'
        },
        target: {
          type: 'string',
          format: 'uuid',
          description: 'Target of the relation'
        }
      }
    },
    query: {
      type: 'object',
      properties: {
        name: {
          description: 'filter relations by name',
          type: 'string',
          default: ''
        },
        exclude: {
          description: 'Exclude relations that you don\'t want to see. For example: YOu are showing 2 relations, but have 4 on database, you would like to see just the two that doesn\'t match. Values splitted by comma',
          type: 'string',
          default: ''
        }
      }
    },
    response: {
      200: {
        type: 'array',
        properties: {
          items: {
            $ref: 'relation'
          }
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
  deleteById,
  listAllConnections
}
