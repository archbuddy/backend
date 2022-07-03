const { preHandler, preValidation } = require('../hook/diagramItem.js')
const diagramItemController = require('../controller/diagramItem.js')
const { getPageSchema } = require('../swagger.js')
const { diagramItemSchema, diagramItemUpsertSchema } = require('../schema/diagramItem.js')
const { fiqlDescription } = require('./base')

const list = {
  preValidation,
  preHandler,
  handler: diagramItemController.list,
  schema: {
    tags: ['DiagramItem'],
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
      200: getPageSchema('diagramItem')
    }
  }
}
const byId = {
  preValidation,
  preHandler,
  handler: diagramItemController.byId,
  schema: {
    tags: ['DiagramItem'],
    response: {
      200: { $ref: 'diagramItem' }
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
  handler: diagramItemController.byId,
  schema: {
    tags: ['DiagramItem'],
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
  handler: diagramItemController.create,
  schema: {
    tags: ['DiagramItem'],
    body: diagramItemUpsertSchema,
    response: {
      201: {
        description: 'Successfully created item',
        type: 'null',
        headers: {
          Location: {
            type: 'string',
            description: 'Location of the new DiagramItem'
          }
        }
      }
    }
  }
}
const update = {
  preValidation,
  preHandler,
  handler: diagramItemController.update,
  schema: {
    tags: ['DiagramItem'],
    body: diagramItemUpsertSchema,
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
  handler: diagramItemController.partialUpdate,
  schema: {
    tags: ['DiagramItem'],
    body: {
      type: 'object',
      properties: diagramItemUpsertSchema.properties
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
  handler: diagramItemController.deleteById,
  schema: {
    tags: ['DiagramItem'],
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
