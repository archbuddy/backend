const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const base = require('./base')
const { Schema } = mongoose
const model = require('../../util/model')

const schema = new Schema({
  _id: { type: String, default: uuidv4 },
  // It represents where the tag can be used
  type: { type: String, required: true, trim: true, enum: model.getEnumTagType() },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: false, trim: true },
  includedAt: { type: Date, default: Date.now }
})

base.defaultBehaviour(schema)

function tagModel () {
  return mongoose.model('tag', schema, 'tags')
}

module.exports = { tagModel, schema }
