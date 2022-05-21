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
        source: {
          type: 'object',
          required: ['handle', 'node'],
          properties: {
            handle: {
              type: 'string'
            },
            node: {
              $ref: 'node'
            }
          }
        },
        target: {
          type: 'object',
          required: ['handle', 'node'],
          properties: {
            handle: {
              type: 'string'
            },
            node: {
              $ref: 'node'
            }
          }
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
edgeUpsertSchema.properties.source = {
  type: 'object',
  required: ['handle', 'node'],
  properties: {
    handle: {
      type: 'string'
    },
    node: {
      format: 'uuid',
      type: 'string'
    }
  }
}
edgeUpsertSchema.properties.target = {
  type: 'object',
  required: ['handle', 'node'],
  properties: {
    handle: {
      type: 'string'
    },
    node: {
      format: 'uuid',
      type: 'string'
    }
  }
}
edgeUpsertSchema.properties.relation = {
  format: 'uuid',
  type: 'string'
}

module.exports = { edgeSchema, edgeUpsertSchema }
