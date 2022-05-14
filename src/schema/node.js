const { diagramItemUpsertSchema } = require('./diagramItem')

const nodeSchema = {
  $id: 'node',
  allOf: [
    {
      $ref: 'diagramItem'
    },
    {
      type: 'object',
      required: ['x', 'y', 'entity'],
      properties: {
        x: {
          type: 'number'
        },
        y: {
          type: 'number'
        },
        entity: {
          $ref: 'entity'
        }
      }
    }
  ]
}

const nodeUpsertSchema = JSON.parse(JSON.stringify(diagramItemUpsertSchema))
nodeSchema.properties = { ...diagramItemUpsertSchema.properties }
nodeUpsertSchema.required.push('x')
nodeUpsertSchema.required.push('y')
nodeUpsertSchema.required.push('entity')
nodeUpsertSchema.properties.x = {
  type: 'number'
}
nodeUpsertSchema.properties.y = {
  type: 'number'
}
nodeUpsertSchema.properties.entity = {
  format: 'uuid',
  type: 'string'
}

module.exports = { nodeSchema, nodeUpsertSchema }
