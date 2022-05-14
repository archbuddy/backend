const mongoose = require('mongoose')
const { diagramModel } = require('./diagram')

const { Schema } = mongoose
const options = { discriminatorKey: 'kind' }

const diagramItemSchema = new Schema({
  id: String,
  diagram: {
    type: Schema.Types.String,
    ref: diagramModel(),
    relationship: {
      type: 'ONE_TO_ONE',
      localField: 'diagram',
      foreignField: 'id'
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
