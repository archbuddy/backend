const diagramSchema =
{
  $id: 'diagram',
  type: 'object',
  required: ['name'],
  properties: {
    _id: {
      type: 'string',
      format: 'uuid'
    },
    name: {
      type: 'string'
    },
    entity: {
      $ref: 'entity',
      description: 'Is used for drill down proposal for level 2, 3, etc'
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
