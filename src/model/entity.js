const mongoose = require('mongoose')

const { Schema } = mongoose

const entitySchema = new Schema({
  id: String,
  name: String,
  description: String,
  type: {
    type: String,
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
    type: String,
    enum: ['internal', 'external'],
    default: 'internal'
  },
  includedAt: Date,
  updatedAt: Date,
  active: Boolean
})

function entityModel () {
  return mongoose.model('entity', entitySchema, 'entities')
}

module.exports = { entityModel, entitySchema }
