const Ajv = require('ajv')
const ajv = new Ajv({ allErrors: true })

const schema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string', minLength: 5 },
    nodes: { type: 'array', minItems: 1, uniqueItems: true, items: { type: 'string' } },
    edges: { type: 'array', minItems: 0, uniqueItems: true, items: { type: 'string' } }
  },
  required: ['id', 'name', 'nodes'],
  additionalProperties: false
}

const validate = ajv.compile(schema)

module.exports = validate
