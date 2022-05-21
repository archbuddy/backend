const mongoose = require('mongoose')
const { entityModel } = require('./entity')
const { v4: uuidv4 } = require('uuid')

const { Schema } = mongoose

const relationSchema = new Schema({
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

function relationModel () {
  return mongoose.model('relation', relationSchema, 'relations')
}

module.exports = { relationSchema, relationModel }
