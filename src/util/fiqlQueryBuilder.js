const parser = require('fiql-parser')

export function buildQuery (model, params) {
  params = {
    ...{ limit: 10, skip: 0 },
    ...params
  }

  let filters = {}
  let filedsAggregations = []

  if (params.fiql) {
    const parsed = parser.parse(params.fiql)
    const { filter, aggregations } = _buildQuery(model, parsed)
    filters = filter
    filedsAggregations = { ...filedsAggregations, ...aggregations }
  }

  let selectFields = []
  if (params.fields && params.fields !== '*') {
    selectFields = params.fields.split(',')
    selectFields.forEach((field) => {
      const { aggregations } = _getFieldDetails(model, field)
      filedsAggregations = { ...filedsAggregations, ...aggregations }
    })
  }

  let aggs = []
  for (const key in filedsAggregations) {
    if (Object.hasOwnProperty.call(filedsAggregations, key)) {
      aggs = aggs.concat(filedsAggregations[key])
    }
  }

  if (aggs.length > 0) {
    aggs.push({
      $match: filters
    })

    if (selectFields.length > 0) {
      const projectSpec = {}
      selectFields.forEach((field) => {
        const { localField } = _getFieldDetails(model, field)
        projectSpec[field] = `$${localField}`
      })
      aggs.push({
        $project: projectSpec
      })
    }
  }

  let query = {}
  if (aggs.length <= 0) {
    query = model.find(filters)
    if (selectFields.length > 0) {
      query = query.select(selectFields.join(' '))
    }
  } else {
    query = model.aggregate(aggs)
  }

  return query.skip(parseInt(params.skip)).limit(parseInt(params.limit))
}

const _buildQuery = (model, parsedFiql) => {
  if (parsedFiql.type === 'CONSTRAINT') {
    return _buildConstraintQuery(model, parsedFiql)
  } else {
    return _buildCombinationQuery(model, parsedFiql)
  }
}

const _buildCombinationQuery = (model, parsedFiql) => {
  const lhsQuery = _buildQuery(model, parsedFiql.lhs)
  const rhsQuery = _buildQuery(model, parsedFiql.rhs)
  const conditions = [lhsQuery.filter, rhsQuery.filter]
  const filter =
    parsedFiql.operator === 'AND' ? { $and: conditions } : { $or: conditions }

  const aggregations = { ...lhsQuery.aggregations, ...rhsQuery.aggregations }

  return { filter, aggregations }
}

const _buildConstraintQuery = (model, parsedFiql) => {
  const fieldPath = parsedFiql.selector
  const { fieldDefinition, aggregations, localField } = _getFieldDetails(
    model,
    fieldPath
  )
  const value = _formatValue(fieldDefinition, parsedFiql.argument)

  const filter = {}
  switch (parsedFiql.comparison) {
    case '==':
      filter[localField] = value
      break
    case '!=':
      filter[localField] = { $ne: value }
      break
    case '=gt=':
      filter[localField] = { $gt: value }
      break
    case '=ge=':
      filter[localField] = { $gte: value }
      break
    case '=lt=':
      filter[localField] = { $lt: value }
      break
    case '=le=':
      filter[localField] = { $lte: value }
      break
    case '=re=': {
      let regex
      let options = null
      if (value instanceof Array) {
        regex = value[0]
        options = value[1]
      } else if (typeof value === 'string') {
        regex = value
      }

      if (fieldDefinition.instance.toLowerCase() !== 'string') {
        throw new Error('Regex is available only for string fields')
      }

      const re = options ? new RegExp(regex, options) : new RegExp(regex)

      filter[localField] = re
      break
    }
    default:
      break
  }

  return { filter, aggregations }
}

const _formatValue = (fieldDefinition, value) => {
  switch (fieldDefinition.instance.toLowerCase()) {
    case 'number':
      return Number(value)
    case 'boolean':
      return value === 'true' || value === '1' || value === 1
    default:
      return value
  }
}

const _getFieldDetails = (model, fieldName) => {
  const fieldParts = fieldName.split('.')
  const localFieldParts = []
  let fieldDefinition
  const aggregations = {}
  let schema = model.schema
  for (let i = 0; i < fieldParts.length; i++) {
    const f = fieldParts[i]
    fieldDefinition = schema.paths[f]

    schema = _getSchemaFromFieldDefinition(fieldDefinition, model)

    if (fieldDefinition.options.relationship) {
      const relationship = fieldDefinition.options.relationship
      localFieldParts.push(
        fieldDefinition.options.relationship.type === 'ONE_TO_ONE'
          ? relationship.localField
          : fieldDefinition.path
      )
      aggregations[fieldParts.slice(0, i + 1).join('.')] =
        _getAggregationForRelationship(
          relationship.type,
          fieldDefinition,
          fieldParts.slice(0, i).concat([relationship.localField]).join('.'),
          relationship.foreignField,
          model
        )
    } else {
      localFieldParts.push(fieldDefinition.path)
    }
  }

  return {
    fieldDefinition,
    aggregations,
    localField: localFieldParts.join('.')
  }
}

const _getAggregationForRelationship = (
  type,
  fieldDefinition,
  localField,
  foreignField,
  model
) => {
  const fieldModel = _getModel(fieldDefinition, model)

  switch (type) {
    case 'ONE_TO_MANY':
      return [
        {
          $lookup: {
            from: fieldModel.collection.collectionName,
            localField,
            foreignField,
            as: fieldDefinition.path
          }
        }
      ]
    case 'ONE_TO_ONE':
      return [
        {
          $lookup: {
            from: fieldModel.collection.collectionName,
            localField,
            foreignField,
            as: localField
          }
        },
        {
          $unwind: {
            path: '$' + localField,
            preserveNullAndEmptyArrays: true
          }
        }
      ]
    default:
      break
  }
}

const _getModel = (fieldDefinition, model) => {
  if (fieldDefinition.options.ref) {
    if (typeof fieldDefinition.options.ref === 'string') {
      return model.base.models[fieldDefinition.options.ref]
    }
    return fieldDefinition.options.ref
  }

  return null
}

const _getSchemaFromFieldDefinition = (fieldDefinition, model) => {
  if (fieldDefinition.schema) return fieldDefinition.schema

  if (fieldDefinition.options.ref) {
    if (typeof fieldDefinition.options.ref === 'string') {
      return model.base.models[fieldDefinition.options.ref].schema
    }
    return fieldDefinition.options.ref.schema
  }

  return null
}
