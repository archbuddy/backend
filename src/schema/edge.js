const { diagramItemUpsertSchema } = require('./diagramItem')

const edgeSchema = {
  $id: 'edge',
  allOf: [
    {
      $ref: 'diagramItem'
    },
    {
      type: 'object',
      required: ['name'],
      properties: {
        sourceHandle: {
          type: 'string'
        },
        targetHandle: {
          type: 'string'
        },
        relation: {
          $ref: 'relation'
        }
      }
    }
  ]
}

const edgeUpsertSchema = JSON.parse(JSON.stringify(diagramItemUpsertSchema))
edgeUpsertSchema.properties = { ...diagramItemUpsertSchema.properties }
edgeUpsertSchema.properties.sourceHandle = {
  type: 'string'
}
edgeUpsertSchema.properties.targetHandle = {
  type: 'string'
}

edgeUpsertSchema.properties.relation = {
  format: 'uuid',
  type: 'string'
}

module.exports = { edgeSchema, edgeUpsertSchema }
