const { preHandler, preValidation } = require('../hook/edge.js')
const edgeController = require('../controller/edge.js')
const { getPageSchema } = require('../swagger.js')
const { edgeUpsertSchema } = require('../schema/edge.js')
const { diagramItemSchema } = require('../schema/diagramItem.js')
const { fiqlDescription } = require('./base')

const list = {
  preValidation,
  preHandler,
  handler: edgeController.list,
  schema: {
    tags: ['Edge'],
    query: {
      type: 'object',
      properties: {
        fields: {
          description:
            'Filter to select fields thar must be returned. Ex.: "?fields=id,name"',
          type: 'string',
          default: ''
        },
        fiql: {
          description: fiqlDescription,
          type: 'string',
          default: ''
        },
        offset: {
          description: 'Number of records to be skipped',
          type: 'integer',
          default: 0
        },
        limit: {
          description: 'Number of records to be returned',
          type: 'integer',
          default: 10
        }
      }
    },
    response: {
      200: getPageSchema('edge')
    }
  }
}
const byId = {
  preValidation,
  preHandler,
  handler: edgeController.byId,
  schema: {
    tags: ['Edge'],
    response: {
      200: { $ref: 'edge' }
    },
    params: {
      type: 'object',
      properties: {
        id: {
          ...diagramItemSchema.properties.id,
          description: 'Id'

        }
      }
    }
  }
}
const byIdHead = {
  preValidation,
  preHandler,
  handler: edgeController.byId,
  schema: {
    tags: ['Edge'],
    response: {
      200: { type: 'null' }
    },
    params: {
      type: 'object',
      properties: {
        id: {
          ...diagramItemSchema.properties.id,
          description: 'Id'

        }
      }
    }
  }
}
const create = {
  preValidation,
  preHandler,
  handler: edgeController.create,
  schema: {
    tags: ['Edge'],
    body: edgeUpsertSchema,
    response: {
      201: {
        description: 'Successfully created item',
        type: 'null',
        headers: {
          Location: {
            type: 'string',
            description: 'Location of the new Edge'
          }
        }
      }
    }
  }
}
const update = {
  preValidation,
  preHandler,
  handler: edgeController.update,
  schema: {
    tags: ['Edge'],
    body: edgeUpsertSchema,
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
          ...diagramItemSchema.properties.id,
          description: 'Id'

        }
      }
    }
  }
}
const partialUpdate = {
  preValidation,
  preHandler,
  handler: edgeController.partialUpdate,
  schema: {
    tags: ['Edge'],
    body: {
      type: 'object',
      properties: edgeUpsertSchema.properties
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
          ...diagramItemSchema.properties.id,
          description: 'Id'

        }
      }
    }
  }
}
const deleteById = {
  preValidation,
  preHandler,
  handler: edgeController.deleteById,
  schema: {
    tags: ['Edge'],
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
          ...diagramItemSchema.properties.id,
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
