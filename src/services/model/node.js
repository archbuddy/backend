const mongoose = require('mongoose')
const { diagramItemModel } = require('./diagramItem')
const { entityModel } = require('./entity')
const base = require('./base')
const { Schema } = mongoose
const options = { discriminatorKey: 'kind' }
const model = require('../../util/model')

const schema = new Schema({
  x: Number,
  y: Number,
  variant: {
    type: String,
    required: true,
    trim: true,
    enum: model.getEnumC4Variants()
  },
  entity: {
    type: String,
    ref: entityModel(),
    relationship: {
      type: 'ONE_TO_ONE',
      localField: 'source',
      foreignField: '_id'
    },
    required: true
  }
})

base.defaultBehaviour(schema)

function nodeModel () {
  const model = diagramItemModel()
  return model.discriminators?.node ?? model.discriminator('node', schema, options)
}

module.exports = { schema, nodeModel }
