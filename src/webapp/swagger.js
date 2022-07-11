const fs = require('fs-extra')
const { resolve, basename, extname } = require('path')

function getSchemas () {
  const schemasDir = resolve(__dirname, 'schema')
  let schemas = []
  if (fs.pathExistsSync(schemasDir)) {
    schemas = fs.readdirSync(schemasDir).map((fileName) => {
      return {
        $id: basename(fileName, extname(fileName)),
        ...fs.readJsonSync(resolve(schemasDir, fileName))
      }
    })
  }
  return schemas
}

function getPackageInfo () {
  return fs.readJsonSync(resolve(process.cwd(), 'package.json'))
}

function getOpenapiDefinition () {
  const packageInfo = getPackageInfo()

  return {
    routePrefix: '/doc',
    openapi: {
      info: {
        title: packageInfo.name,
        description: packageInfo.description,
        version: packageInfo.version
      }
    },
    uiConfig: {
      deepLinking: false
    },
    staticCSP: true,
    transformStaticCSP: (header) => {
      return header
    },
    exposeRoute: true
  }
}

function getPageSchema (schemaName) {
  return {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: {
          allOf: [
            {
              $ref: schemaName
            },
            {
              type: 'object',
              properties: {
                _links: {
                  type: 'object',
                  properties: {
                    self: { type: 'string' }
                  }
                }
              }
            }
          ]
        }
      },
      _meta: {
        type: 'object',
        properties: {
          offset: { type: 'number' },
          limit: { type: 'number' },
          total: { type: 'number' }
        }
      },
      _links: {
        type: 'object',
        properties: {
          self: { type: 'string' },
          next: { type: 'string' },
          last: { type: 'string' },
          first: { type: 'string' },
          prev: { type: 'string' }
        }
      }
    }
  }
}

module.exports = { getSchemas, getOpenapiDefinition, getPageSchema }
