const diagramItemSchema = {
  $id: 'diagramItem',
  type: 'object',
  required: ['diagram'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid'
    },
    diagram: {
      $ref: 'diagram'
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

const diagramItemUpsertSchema = {
  type: 'object',
  required: ['diagram'],
  properties: {
    diagram: {
      type: 'string',
      format: 'uuid'
    },
    active: {
      type: 'boolean'
    }
  }
}

module.exports = { diagramItemSchema, diagramItemUpsertSchema }
