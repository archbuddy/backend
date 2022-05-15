const mongoose = require('mongoose')
const { entityModel } = require('./entity')

const { Schema } = mongoose

const relationSchema = new Schema({
  id: String,
  description: String,
  detail: String,
  source: {
    type: Schema.Types.String,
    ref: entityModel(),
    relationship: {
      type: 'ONE_TO_ONE',
      localField: 'source',
      foreignField: 'id'
    }
  },
  target: {
    type: Schema.Types.String,
    ref: entityModel(),
    relationship: {
      type: 'ONE_TO_ONE',
      localField: 'source',
      foreignField: 'id'
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
