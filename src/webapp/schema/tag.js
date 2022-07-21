const model = require('../../util/model')

const tagSchema = {
  $id: 'tag',
  type: 'object',
  required: ['name', 'type'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid'
    },
    name: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    type: {
      type: 'array',
      items: {
        type: 'string',
        enum: model.getEnumTagType()
      }
    },
    includedAt: {
      type: 'string',
      format: 'date-time'
    }
  }
}

const tagUpsertSchema = {
  type: 'object',
  required: ['name', 'type'],
  properties: {
    name: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    type: {
      type: 'array',
      items: {
        type: 'string',
        enum: model.getEnumTagType()
      }
    }
  }
}

module.exports = { tagSchema, tagUpsertSchema }
