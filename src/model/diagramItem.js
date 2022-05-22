const mongoose = require('mongoose')
const { diagramModel } = require('./diagram')
const { v4: uuidv4 } = require('uuid')

const { Schema } = mongoose
const options = { discriminatorKey: 'kind' }

const diagramItemSchema = new Schema({
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

function diagramItemModel () {
  return mongoose.model('diagramItem', diagramItemSchema, 'diagramItems', options)
}

module.exports = {
  diagramItemSchema, diagramItemModel
}
