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

// TODO review which params are required and the type of each
const nodeUpsertSchema = JSON.parse(JSON.stringify(diagramItemUpsertSchema))
nodeSchema.properties = { ...diagramItemUpsertSchema.properties }
nodeUpsertSchema.required.push('name')
nodeUpsertSchema.required.push('x')
nodeUpsertSchema.required.push('y')
nodeUpsertSchema.properties.x = {
  type: 'number'
}
nodeUpsertSchema.properties.y = {
  type: 'number'
}
nodeUpsertSchema.properties.name = {
  type: 'string'
}

module.exports = { nodeSchema, nodeUpsertSchema }
