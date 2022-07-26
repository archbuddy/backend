const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const { diagramItemModel } = require('./diagramItem')
const { relationModel } = require('./relation')
const { nodeModel } = require('./node')
const base = require('./base')
const { Schema } = mongoose
const options = { discriminatorKey: 'kind' }

const schema = new Schema({
  source: new Schema({
    _id: { type: String, default: uuidv4 },
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
    _id: { type: String, default: uuidv4 },
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
    _id: { type: String, default: uuidv4 },
    type: String,
    ref: relationModel(),
    relationship: {
      type: 'ONE_TO_ONE',
      localField: 'relation',
      foreignField: '_id'
    }
  }
})

base.defaultBehaviour(schema)

function edgeModel () {
  const model = diagramItemModel()
  return model.discriminators?.edge ?? model.discriminator('edge', schema, options)
}

module.exports = { schema, edgeModel }
