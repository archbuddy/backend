const mongoose = require('mongoose')
const { diagramItemModel } = require('./diagramItem')
const { entityModel } = require('./entity')

const { Schema } = mongoose
const options = { discriminatorKey: 'kind' }

const nodeSchema = new Schema({
  x: Number,
  y: Number,
  entity: {
    type: String,
    ref: entityModel(),
    relationship: {
      type: 'ONE_TO_ONE',
      localField: 'source',
      foreignField: '_id'
    }
  }
})

function nodeModel () {
  const model = diagramItemModel()
  return model.discriminators?.node ?? model.discriminator('node', nodeSchema, options)
}

module.exports = { nodeSchema, nodeModel }
