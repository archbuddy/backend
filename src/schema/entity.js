const entitySchema = {
  $id: 'entity',
  type: 'object',
  required: ['name', 'description', 'type'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid'
    },
    name: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    type: {
      type: 'string',
      enum: [
        'person',
        'system',
        'container',
        'storageContainer',
        'microserviceContainer',
        'busContainer',
        'webContainer',
        'mobContainer'
      ]
    },
    variant: {
      type: 'string',
      enum: ['internal', 'external']
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

const entityUpsertSchema = {

  type: 'object',
  required: ['name', 'description', 'type'],
  properties: {
    name: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    type: {
      type: 'string',
      enum: [
        'person',
        'system',
        'container',
        'storageContainer',
        'microserviceContainer',
        'busContainer',
        'webContainer',
        'mobContainer'
      ]
    },
    variant: {
      type: 'string',
      enum: ['internal', 'external']
    },
    active: {
      type: 'boolean'
    }
  }
}

module.exports = { entitySchema, entityUpsertSchema }
