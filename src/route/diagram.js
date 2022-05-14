const { preHandler, preValidation } = require('../hook/diagram.js')
const diagramController = require('../controller/diagram.js')
const { getPageSchema } = require('../swagger.js')
const { diagramSchema, diagramUpsertSchema } = require('../schema/diagram.js')

const list = {
  preValidation,
  preHandler,
  handler: diagramController.list,
  schema: {
    tags: ['Diagram'],
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
      200: getPageSchema('diagram')
    }
  }
}
const byId = {
  preValidation,
  preHandler,
  handler: diagramController.byId,
  schema: {
    tags: ['Diagram'],
    response: {
      200: { $ref: 'diagram' }
    },
    params: {
      type: 'object',
      properties: {
        id: {
          ...diagramSchema.properties.id,
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
  handler: diagramController.byId,
  schema: {
    tags: ['Diagram'],
    response: {
      200: { type: 'null' }
    },
    params: {
      type: 'object',
      properties: {
        id: {
          ...diagramSchema.properties.id,
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
  handler: diagramController.create,
  schema: {
    tags: ['Diagram'],
    body: diagramUpsertSchema,
    response: {
      201: {
        description: 'Successfully created item',
        type: 'null',
        headers: {
          Location: {
            type: 'string',
            description: 'Location of the new Diagram'
          }
        }
      }
    }
  }
}
const update = {
  preValidation,
  preHandler,
  handler: diagramController.update,
  schema: {
    tags: ['Diagram'],
    body: diagramUpsertSchema,
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
          ...diagramSchema.properties.id,
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
  handler: diagramController.partialUpdate,
  schema: {
    tags: ['Diagram'],
    body: {
      type: 'object',
      properties: diagramUpsertSchema.properties
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
          ...diagramSchema.properties.id,
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
  handler: diagramController.deleteById,
  schema: {
    tags: ['Diagram'],
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
          ...diagramSchema.properties.id,
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
