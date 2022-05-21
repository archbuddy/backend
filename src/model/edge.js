const mongoose = require('mongoose')
const { diagramItemModel } = require('./diagramItem')
const { relationModel } = require('./relation')
const { nodeModel } = require('./node')

const { Schema } = mongoose
const options = { discriminatorKey: 'kind' }

const edgeSchema = new Schema({
  source: new Schema({
    handle: String,
    node: {
      type: String,
      ref: nodeModel(),
      relationship: {
        type: 'ONE_TO_ONE',
        localField: 'node',
        foreignField: '_id'
      }
    }
  }),
  target: new Schema({
    handle: String,
    node: {
      type: String,
      ref: nodeModel(),
      relationship: {
        type: 'ONE_TO_ONE',
        localField: 'node',
        foreignField: '_id'
      }
    }
  }),
  relation: {
    type: String,
    ref: relationModel(),
    relationship: {
      type: 'ONE_TO_ONE',
      localField: 'relation',
      foreignField: '_id'
    }
  }
})

function edgeModel () {
  const model = diagramItemModel()
  return model.discriminators?.edge ?? model.discriminator('edge', edgeSchema, options)
}

module.exports = { edgeSchema, edgeModel }
