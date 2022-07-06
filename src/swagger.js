const fs = require('fs-extra')
const { resolve } = require('path')

function getPackageInfo () {
  return fs.readJsonSync(resolve(process.cwd(), 'package.json'))
}

function getOpenApiDefinition () {
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
      docExpansion: 'full',
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

module.exports = { getOpenApiDefinition, getPageSchema }
