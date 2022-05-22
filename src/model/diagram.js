const mongoose = require('mongoose')
const { entityModel } = require('./entity.js')
const { v4: uuidv4 } = require('uuid')

const { Schema } = mongoose

const diagramSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  name: String,
  entity: {
    type: String,
    ref: entityModel(),
    relationship: {
      type: 'ONE_TO_ONE',
      localField: 'source',
      foreignField: '_id'
    }
  },
  includedAt: Date,
  updatedAt: Date,
  active: Boolean
})

function diagramModel () {
  return mongoose.model('diagram', diagramSchema, 'diagrams')
}

module.exports = { diagramSchema, diagramModel }
