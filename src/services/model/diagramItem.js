const mongoose = require('mongoose')
const { diagramModel } = require('./diagram')
const { v4: uuidv4 } = require('uuid')
const base = require('./base')
const { Schema } = mongoose
const options = { discriminatorKey: 'kind' }

const schema = new Schema({
  _id: { type: String, default: uuidv4 },
  diagram: {
    type: String,
    ref: diagramModel(),
    relationship: {
      type: 'ONE_TO_ONE',
      localField: 'diagram',
      foreignField: '_id'
    }
  },
  includedAt: Date,
  updatedAt: Date,
  active: Boolean
})

base.defaultBehaviour(schema)

function diagramItemModel () {
  return mongoose.model('diagramItem', schema, 'diagramItems', options)
}

module.exports = {
  schema, diagramItemModel
}
