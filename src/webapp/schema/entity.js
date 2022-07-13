const model = require('../../util/model')

const entitySchema = {
  $id: 'entity',
  type: 'object',
  required: ['name', 'description', 'type'],
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
      type: 'string',
      enum: model.getEnumEntityTypes()
    },
    variant: {
      type: 'string',
      enum: model.getEnumC4Variants()
    },
    includedAt: {
      type: 'string',
      format: 'date-time'
    },
    updatedAt: {
      type: 'string',
      format: 'date-time'
    },
    active: {
      type: 'boolean'
    }
  }
}

const entityUpsertSchema = {

  type: 'object',
  required: ['name', 'description', 'type'],
  properties: {

    name: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    type: {
      type: 'string',
      enum: model.getEnumEntityTypes()
    },
    variant: {
      type: 'string',
      enum: model.getEnumC4Variants()
    },
    active: {
      type: 'boolean'
    }
  }
}

module.exports = { entitySchema, entityUpsertSchema }
