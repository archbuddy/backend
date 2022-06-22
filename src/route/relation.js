const { preHandler, preValidation } = require('../hook/relation.js')
const relationController = require('../controller/relation.js')
const { getPageSchema } = require('../swagger.js')
const { relationSchema, relationUpsertSchema } = require('../schema/relation.js')
const { fiqlDescription } = require('./base')

const list = {
  preValidation,
  preHandler,
  handler: relationController.list,
  schema: {
    tags: ['Relation'],
    query: {
      type: 'object',
      properties: {
        fields: {
          description:
            'Filter to select fields thar must be returned. Ex.: "?fields=id,name"',
          type: 'string',
          in: 'query',
          default: ''
        },
        fiql: {
          description: fiqlDescription,
          type: 'string',
          in: 'query',
          default: ''
        },
        offset: {
          description: 'Number of records to be skipped',
          type: 'integer',
          in: 'query',
          default: 0
        },
        limit: {
          description: 'Number of records to be returned',
          type: 'integer',
          in: 'query',
          default: 10
        }
      }
    },
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
          description: 'Id',
          in: 'query'
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
          description: 'Id',
          in: 'query'
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
          description: 'Id',
          in: 'query'
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
          description: 'Id',
          in: 'query'
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
          description: 'Id',
          in: 'query'
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
