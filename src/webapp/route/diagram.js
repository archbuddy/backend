const { preHandler, preValidation } = require('./hook/default.js')
const diagramController = require('../../services/controller/diagram.js')
const { getPageSchema } = require('../swagger.js')
const { diagramSchema, diagramUpsertSchema } = require('../schema/diagram.js')
const { getListSchemaDefaultQueryProperty } = require('./base')

const list = {
  preValidation,
  preHandler,
  handler: diagramController.list,
  schema: {
    tags: ['Diagram'],
    query: getListSchemaDefaultQueryProperty(),
    response: {
      200: getPageSchema('diagram')
    }
  }
}
const byId = {
  preValidation,
  preHandler,
  handler: diagramController.byId,
  schema: {
    tags: ['Diagram'],
    response: {
      200: { $ref: 'diagram' }
    },
    params: {
      type: 'object',
      properties: {
        id: {
          ...diagramSchema.properties.id,
          description: 'Id'
        }
      }
    }
  }
}
const byIdHead = {
  preValidation,
  preHandler,
  handler: diagramController.byId,
  schema: {
    tags: ['Diagram'],
    response: {
      200: { type: 'null' }
    },
    params: {
      type: 'object',
      properties: {
        id: {
          ...diagramSchema.properties.id,
          description: 'Id'

        }
      }
    }
  }
}
const create = {
  preValidation,
  preHandler,
  handler: diagramController.create,
  schema: {
    tags: ['Diagram'],
    body: diagramUpsertSchema,
    response: {
      201: {
        description: 'Successfully created item',
        type: 'null',
        headers: {
          Location: {
            type: 'string',
            description: 'Location of the new Diagram'
          }
        }
      }
    }
  }
}
const update = {
  preValidation,
  preHandler,
  handler: diagramController.update,
  schema: {
    tags: ['Diagram'],
    body: diagramUpsertSchema,
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
          ...diagramSchema.properties.id,
          description: 'Id'

        }
      }
    }
  }
}
const partialUpdate = {
  preValidation,
  preHandler,
  handler: diagramController.partialUpdate,
  schema: {
    tags: ['Diagram'],
    body: {
      type: 'object',
      properties: diagramUpsertSchema.properties
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
          ...diagramSchema.properties.id,
          description: 'Id'

        }
      }
    }
  }
}
const deleteById = {
  preValidation,
  preHandler,
  handler: diagramController.deleteById,
  schema: {
    tags: ['Diagram'],
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
          ...diagramSchema.properties.id,
          description: 'Id'

        }
      }
    }
  }
}
const reactFlow = {
  preValidation,
  preHandler,
  handler: diagramController.reactFlow
}
module.exports = {
  list,
  byId,
  byIdHead,
  create,
  update,
  partialUpdate,
  deleteById,
  reactFlow
}
