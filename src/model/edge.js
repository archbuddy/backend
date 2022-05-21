const mongoose = require('mongoose')
const { diagramItemModel } = require('./diagramItem')
const { relationModel } = require('./relation')

const { Schema } = mongoose
const options = { discriminatorKey: 'kind' }

const edgeSchema = new Schema({
  sourceHandle: String,
  targetHandle: String,
  relation: {
    type: String,
    ref: relationModel(),
    relationship: {
      type: 'ONE_TO_ONE',
      localField: 'source',
      foreignField: '_id'
    }
  }
})

function edgeModel () {
  const model = diagramItemModel()
  return model.discriminators?.edge ?? model.discriminator('edge', edgeSchema, options)
}

module.exports = { edgeSchema, edgeModel }
