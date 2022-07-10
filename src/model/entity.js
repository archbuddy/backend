const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const base = require('./base')
const { Schema } = mongoose

const schema = new Schema({
  _id: { type: String, default: uuidv4 },
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

base.defaultBehaviour(schema)

function entityModel () {
  return mongoose.model('entity', schema, 'entities')
}

module.exports = { entityModel, schema }
