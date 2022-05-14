const mongoose = require('mongoose')
const { diagramItemModel } = require('./diagramItem')
const { entityModel } = require('./entity')

const { Schema } = mongoose
const options = { discriminatorKey: 'kind' }

const nodeSchema = new Schema({
  x: Number,
  y: Number,
  entity: {
    type: Schema.Types.String,
    ref: entityModel(),
    relationship: {
      type: 'ONE_TO_ONE',
      localField: 'source',
      foreignField: 'id'
    }
  }
})

function nodeModel () {
  return diagramItemModel.discriminator('node', nodeSchema, options)
}

module.exports = { nodeSchema, nodeModel }
