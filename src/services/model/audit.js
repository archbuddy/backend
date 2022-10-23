const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const base = require('./base')
const { Schema } = mongoose

const schema = new Schema({
  _id: { type: String, default: uuidv4 },
  action: { type: String, required: true, trim: true, enum: ['INSERT', 'UPDATE', 'DELETE', 'LOGIN'] },
  description: { type: String, required: true, trim: true },
  user: { type: String, required: true, trim: true },
  includedAt: { type: Date, default: Date.now },
  object: { type: 'object', required: false }
})

base.defaultBehaviour(schema)

function auditModel () {
  return mongoose.model('audit', schema, 'audits')
}

module.exports = { auditModel, schema }
