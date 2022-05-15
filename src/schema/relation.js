
const relationSchema = {
  $id: 'relation',
  type: 'object',
  required: ['description', 'source', 'target'],
  properties: {
    id: {
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
      $ref: 'entity'
    },
    target: {
      $ref: 'entity'
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
