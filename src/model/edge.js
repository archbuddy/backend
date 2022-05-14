const mongoose = require('mongoose')
const { diagramItemModel } = require('./diagramItem')
const { relationModel } = require('./relation')

const { Schema } = mongoose
const options = { discriminatorKey: 'kind' }

const edgeSchema = new Schema({
  sourceHandle: String,
  targetHandle: String,
  relation: {
    type: Schema.Types.String,
    ref: relationModel(),
    relationship: {
      type: 'ONE_TO_ONE',
      localField: 'source',
      foreignField: 'id'
    }
  }
})

function edgeModel () {
  return diagramItemModel.discriminator('edge', edgeSchema, options)
}

module.exports = { edgeSchema, edgeModel }
