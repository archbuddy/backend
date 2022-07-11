const diagramItemSchema = {
  $id: 'diagramItem',
  type: 'object',
  required: ['diagram'],
  properties: {
    _id: {
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

// TODO define if the uuid is required for diagram
const diagramItemUpsertSchema = {
  type: 'object',
  required: ['diagram'],
  properties: {
    diagram: {
      type: 'string'
    },
    active: {
      type: 'boolean'
    }
  }
}

module.exports = { diagramItemSchema, diagramItemUpsertSchema }
