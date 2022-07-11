/**
 * https://mongoosejs.com/docs/guide.html#collection
 * https://mongoosejs.com/docs/api.html#document_Document-toObject
 * @param {*} schema
 */
const defaultBehaviour = (schema) => {
  schema.options.getters = true
  schema.options.virtuals = false
  schema.options.versionKey = false
  schema.options.toObject = {}
  schema.options.toObject.transform = function (doc, ret, _options) {
    // remove the _id of every document before returning the result
    delete ret._id
    ret.id = doc._id
    return ret
  }
}

module.exports = {
  defaultBehaviour
}
