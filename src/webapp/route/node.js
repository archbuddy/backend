const { preHandler, preValidation } = require('./hook/default.js')
const nodeController = require('../../services/controller/node.js')
const { getPageSchema } = require('../swagger.js')
const { nodeUpsertSchema } = require('../schema/node.js')
const { diagramItemSchema } = require('../schema/diagramItem.js')
const { getListSchemaDefaultQueryProperty } = require('./base')

const list = {
  preValidation,
  preHandler,
  handler: nodeController.list,
  schema: {
    tags: ['Node'],
    query: getListSchemaDefaultQueryProperty(),
    response: {
      200: getPageSchema('node')
    }
  }
}
const byId = {
  preValidation,
  preHandler,
  handler: nodeController.byId,
  schema: {
    tags: ['Node'],
    response: {
      200: { $ref: 'node' }
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
  handler: nodeController.byId,
  schema: {
    tags: ['Node'],
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
  handler: nodeController.create,
  schema: {
    tags: ['Node'],
    body: nodeUpsertSchema,
    response: {
      201: {
        description: 'Successfully created item',
        type: 'null',
        headers: {
          Location: {
            type: 'string',
            description: 'Location of the new Node'
          }
        }
      }
    }
  }
}
const update = {
  preValidation,
  preHandler,
  handler: nodeController.update,
  schema: {
    tags: ['Node'],
    body: nodeUpsertSchema,
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
  handler: nodeController.partialUpdate,
  schema: {
    tags: ['Node'],
    body: {
      type: 'object',
      properties: nodeUpsertSchema.properties
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
  handler: nodeController.deleteById,
  schema: {
    tags: ['Node'],
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
