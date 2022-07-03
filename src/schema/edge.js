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
              // TODO You cannot have the same $id (or the schema identifier) used for more than one schema - the exception will be thrown.
              // $ref: 'node'
              type: 'object'
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
              // TODO You cannot have the same $id (or the schema identifier) used for more than one schema - the exception will be thrown.
              // $ref: 'node'
              type: 'object'
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
