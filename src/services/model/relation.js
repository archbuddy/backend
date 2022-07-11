const mongoose = require('mongoose')
const { entityModel } = require('./entity')
const { v4: uuidv4 } = require('uuid')
const base = require('./base')
const { Schema } = mongoose

const schema = new Schema({
  _id: { type: String, default: uuidv4 },
  description: { type: String, default: '' },
  detail: { type: String, default: '' },
  source: {
    type: String,
    ref: entityModel(),
    relationship: {
      type: 'ONE_TO_ONE',
      localField: 'source',
      foreignField: '_id'
    },
    required: true
  },
  target: {
    type: String,
    ref: entityModel(),
    relationship: {
      type: 'ONE_TO_ONE',
      localField: 'target',
      foreignField: '_id'
    },
    required: true
  },
  includedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: undefined },
  active: { type: Boolean, default: true }
})

base.defaultBehaviour(schema)

function relationModel () {
  return mongoose.model('relation', schema, 'relations')
}

module.exports = { schema, relationModel }
