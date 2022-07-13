const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const base = require('./base')
const { Schema } = mongoose
const model = require('../../util/model')

const schema = new Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  type: {
    type: String,
    enum: model.getEnumEntityTypes(),
    required: true,
    trim: true
  },
  variant: {
    type: String,
    enum: model.getEnumC4Variants(),
    required: true,
    trim: true
  },
  includedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: undefined },
  active: { type: Boolean, default: true }
})

base.defaultBehaviour(schema)

function entityModel () {
  return mongoose.model('entity', schema, 'entities')
}

module.exports = { entityModel, schema }
