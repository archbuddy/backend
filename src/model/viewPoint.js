const Ajv = require('ajv')
const ajv = new Ajv({ allErrors: true })

const nodeSchema = {
  $id: 'http://archbuddy.github.io/nodeViewPoint.json',
  type: 'object',
  properties: {
    id: { type: 'string' },
    position: {
      type: 'object',
      properties: {
        x: { type: 'integer' },
        y: { type: 'integer' }
      },
      required: ['x', 'y'],
      additionalProperties: false
    }
  },
  required: ['id', 'position'],
  additionalProperties: false
}

const schema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string', minLength: 5 },
    nodes: { type: 'array', minItems: 1, uniqueItems: true, items: { $ref: 'http://archbuddy.github.io/nodeViewPoint.json' } },
    edges: { type: 'array', minItems: 0, uniqueItems: true, items: { type: 'string' } }
  },
  required: ['id', 'name', 'nodes'],
  additionalProperties: false
}

const validate = ajv.addSchema(nodeSchema).compile(schema)

module.exports = validate
