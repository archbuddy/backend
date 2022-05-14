const mongoose = require('mongoose')
const { entityModel } = require('./entity.js')

const { Schema } = mongoose

const diagramSchema = new Schema({
  id: String,
  name: String,
  entity: {
    type: Schema.Types.String,
    ref: entityModel(),
    relationship: {
      type: 'ONE_TO_ONE',
      localField: 'entity',
      foreignField: 'id'
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
