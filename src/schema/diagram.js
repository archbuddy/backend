const diagramSchema =
{
  $id: 'diagram',
  type: 'object',
  required: ['name'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid'
    },
    name: {
      type: 'string'
    },
    entity: {
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

const diagramUpsertSchema =
{
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string'
    },
    entity: {
      type: 'string',
      format: 'uuid'
    },
    active: {
      type: 'boolean'
    }
  }
}

module.exports = {
  diagramSchema,
  diagramUpsertSchema
}
