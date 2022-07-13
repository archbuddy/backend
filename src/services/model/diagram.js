const mongoose = require('mongoose')
const { entityModel } = require('./entity.js')
const { v4: uuidv4 } = require('uuid')
const base = require('./base')
const { Schema } = mongoose

const schema = new Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true, trim: true },
  entity: {
    type: String,
    ref: entityModel(),
    relationship: {
      type: 'ONE_TO_ONE',
      localField: 'source',
      foreignField: '_id'
    }
  },
  includedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: undefined },
  active: { type: Boolean, default: true }
})

base.defaultBehaviour(schema)

function diagramModel () {
  return mongoose.model('diagram', schema, 'diagrams')
}

module.exports = { schema, diagramModel }
