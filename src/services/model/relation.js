const mongoose = require('mongoose')
const { entityModel } = require('./entity')
const { v4: uuidv4 } = require('uuid')
const base = require('./base')
const { Schema } = mongoose

const schema = new Schema({
  _id: { type: String, default: uuidv4 },
  description: String,
  detail: String,
  source: {
    type: String,
    ref: entityModel(),
    relationship: {
      type: 'ONE_TO_ONE',
      localField: 'source',
      foreignField: '_id'
    }
  },
  target: {
    type: String,
    ref: entityModel(),
    relationship: {
      type: 'ONE_TO_ONE',
      localField: 'target',
      foreignField: '_id'
    }
  },
  includedAt: Date,
  updatedAt: Date,
  active: Boolean
})

base.defaultBehaviour(schema)

function relationModel () {
  return mongoose.model('relation', schema, 'relations')
}

module.exports = { schema, relationModel }
