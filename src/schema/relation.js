
const relationSchema = {
  $id: 'relation',
  type: 'object',
  required: ['description', 'source', 'target'],
  properties: {
    _id: {
      type: 'string',
      format: 'uuid'
    },
    description: {
      type: 'string'
    },
    detail: {
      type: 'string'
    },
    source: {
      // TODO You cannot have the same $id (or the schema identifier) used for more than one schema - the exception will be thrown.
      // $ref: 'entity'
      type: 'object'
    },
    target: {
      // TODO You cannot have the same $id (or the schema identifier) used for more than one schema - the exception will be thrown.
      // $ref: 'entity'
      type: 'object'
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

const relationUpsertSchema = {
  type: 'object',
  required: ['description', 'source', 'target'],
  properties: {
    description: {
      type: 'string'
    },
    detail: {
      type: 'string'
    },
    source: {
      type: 'string',
      format: 'uuid'
    },
    target: {
      type: 'string',
      format: 'uuid'
    },
    active: {
      type: 'boolean'
    }
  }
}

module.exports = { relationSchema, relationUpsertSchema }
