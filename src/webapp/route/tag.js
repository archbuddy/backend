const { preHandler, preValidation } = require('./hook/default.js')
const tagController = require('../../services/controller/tag.js')
const { getPageSchema } = require('../swagger.js')
const { tagSchema, tagUpsertSchema } = require('../schema/tag.js')
const { getListSchemaDefaultQueryProperty } = require('./base')

const list = {
  preValidation,
  preHandler,
  handler: tagController.list,
  schema: {
    tags: ['Tag'],
    query: getListSchemaDefaultQueryProperty(),
    response: {
      200: getPageSchema('tag')
    }
  }
}
const create = {
  preValidation,
  preHandler,
  handler: tagController.create,
  schema: {
    tags: ['Tag'],
    body: tagUpsertSchema,
    response: {
      201: {
        description: 'Successfully created item',
        type: 'null',
        headers: {
          Location: {
            type: 'string',
            description: 'Location of the new tag'
          }
        }
      }
    }
  }
}
const update = {
  preValidation,
  preHandler,
  handler: tagController.update,
  schema: {
    tags: ['Tag'],
    body: tagUpsertSchema,
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
          ...tagSchema.properties.id,
          description: 'Id'
        }
      }
    }
  }
}

module.exports = {
  list,
  create,
  update
}
