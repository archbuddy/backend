const { preHandler, preValidation } = require('../hook/edge.js')
const edgeController = require('../controller/edge.js')
const { getPageSchema } = require('../swagger.js')
const { edgeUpsertSchema } = require('../schema/edge.js')
const { diagramItemSchema } = require('../schema/diagramItem.js')

const list = {
  preValidation,
  preHandler,
  handler: edgeController.list,
  schema: {
    tags: ['Edge'],
    query: {
      type: 'object',
      properties: {
        fields: {
          description:
            'Filter to select fields thar must be returned. Ex.: "?fields=id,name"',
          type: 'string',
          in: 'query',
          default: ''
        },
        fiql: {
          description: `field you can define complex queries to filter objects. 
            __All object and sub-object properties are available to be used in your query__.

#### Example 
Request: '/entites?fiql=active==true;name==CPLV'

#### Combinations
Operator | Description
--- | ---
; | AND
, | OR
()| Parentheses can be used define precedence


#### Logicals
Operator | Description
--- | ---
== | Equal To
!= | Not Equal To
=gt= | Greater Than
=ge= | Greater Than or Equal To 
=lt= | Less Than
=le= | Less Than or Equal To 
=re= | Regular expressions. Available only for 'string' properties. <br /><br />Format: '('<regular expression>','<options: optional>')' <br /><br /> See details in [mongoDb docs](https://docs.mongodb.com/manual/reference/operator/query/regex/).`,
          type: 'string',
          in: 'query',
          default: ''
        },
        offset: {
          description: 'Number of records to be skipped',
          type: 'integer',
          in: 'query',
          default: 0
        },
        limit: {
          description: 'Number of records to be returned',
          type: 'integer',
          in: 'query',
          default: 10
        }
      }
    },
    response: {
      200: getPageSchema('edge')
    }
  }
}
const byId = {
  preValidation,
  preHandler,
  handler: edgeController.byId,
  schema: {
    tags: ['Edge'],
    response: {
      200: { $ref: 'edge' }
    },
    params: {
      type: 'object',
      properties: {
        id: {
          ...diagramItemSchema.properties.id,
          description: 'Id',
          in: 'query'
        }
      }
    }
  }
}
const byIdHead = {
  preValidation,
  preHandler,
  handler: edgeController.byId,
  schema: {
    tags: ['Edge'],
    response: {
      200: { type: 'null' }
    },
    params: {
      type: 'object',
      properties: {
        id: {
          ...diagramItemSchema.properties.id,
          description: 'Id',
          in: 'query'
        }
      }
    }
  }
}
const create = {
  preValidation,
  preHandler,
  handler: edgeController.create,
  schema: {
    tags: ['Edge'],
    body: edgeUpsertSchema,
    response: {
      201: {
        description: 'Successfully created item',
        type: 'null',
        headers: {
          Location: {
            type: 'string',
            description: 'Location of the new Edge'
          }
        }
      }
    }
  }
}
const update = {
  preValidation,
  preHandler,
  handler: edgeController.update,
  schema: {
    tags: ['Edge'],
    body: edgeUpsertSchema,
    response: {
      204: {
        description: 'Successfully updated item',
        type: 'null'
      }
    },
    params: {
      type: 'object',
      properties: {
        id: {
          ...diagramItemSchema.properties.id,
          description: 'Id',
          in: 'query'
        }
      }
    }
  }
}
const partialUpdate = {
  preValidation,
  preHandler,
  handler: edgeController.partialUpdate,
  schema: {
    tags: ['Edge'],
    body: {
      type: 'object',
      properties: edgeUpsertSchema.properties
    },
    response: {
      204: {
        description: 'Successfully updated item',
        type: 'null'
      }
    },
    params: {
      type: 'object',
      properties: {
        id: {
          ...diagramItemSchema.properties.id,
          description: 'Id',
          in: 'query'
        }
      }
    }
  }
}
const deleteById = {
  preValidation,
  preHandler,
  handler: edgeController.deleteById,
  schema: {
    tags: ['Edge'],
    response: {
      200: {
        description: 'Successfully deleted item',
        type: 'null'
      }
    },
    params: {
      type: 'object',
      properties: {
        id: {
          ...diagramItemSchema.properties.id,
          description: 'Id',
          in: 'query'
        }
      }
    }
  }
}

module.exports = {
  list,
  byId,
  byIdHead,
  create,
  update,
  partialUpdate,
  deleteById
}
