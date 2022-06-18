const { preHandler, preValidation } = require('../hook/relation.js')
const relationController = require('../controller/relation.js')
const { getPageSchema } = require('../swagger.js')
const { relationSchema, relationUpsertSchema } = require('../schema/relation.js')

const list = {
  preValidation,
  preHandler,
  handler: relationController.list,
  schema: {
    tags: ['Relation'],
    query: {
      type: 'object',
      properties: {
        fields: {
          description:
            'Filter to select fields thar must be returned. Ex.: "?fields=id,name"',
          type: 'string',
          default: ''
        },
        fiql: {
          description: `field you can define complex queries to filter objects. 
            __All object and sub-object properties are available to be used in your query__.

#### Example 
Request: '/relations?fiql=active==true;name==User'

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
          default: ''
        },
        offset: {
          description: 'Number of records to be skipped',
          type: 'integer',
          default: 0
        },
        limit: {
          description: 'Number of records to be returned',
          type: 'integer',
          default: 10
        }
      }
    },
    response: {
      200: getPageSchema('relation')
    }
  }
}
const byId = {
  preValidation,
  preHandler,
  handler: relationController.byId,
  schema: {
    tags: ['Relation'],
    response: {
      200: { $ref: 'relation' }
    },
    params: {
      type: 'object',
      properties: {
        id: {
          ...relationSchema.properties.id,
          description: 'Id',
        }
      }
    }
  }
}
const byIdHead = {
  preValidation,
  preHandler,
  handler: relationController.byId,
  schema: {
    tags: ['Relation'],
    response: {
      200: { type: 'null' }
    },
    params: {
      type: 'object',
      properties: {
        id: {
          ...relationSchema.properties.id,
          description: 'Id',
        }
      }
    }
  }
}
const create = {
  preValidation,
  preHandler,
  handler: relationController.create,
  schema: {
    tags: ['Relation'],
    body: relationUpsertSchema,
    response: {
      201: {
        description: 'Successfully created item',
        type: 'null',
        headers: {
          Location: {
            type: 'string',
            description: 'Location of the new Relation'
          }
        }
      }
    }
  }
}
const update = {
  preValidation,
  preHandler,
  handler: relationController.update,
  schema: {
    tags: ['Relation'],
    body: relationUpsertSchema,
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
          ...relationSchema.properties.id,
          description: 'Id',
        }
      }
    }
  }
}
const partialUpdate = {
  preValidation,
  preHandler,
  handler: relationController.partialUpdate,
  schema: {
    tags: ['Relation'],
    body: {
      type: 'object',
      properties: relationUpsertSchema.properties
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
          ...relationSchema.properties.id,
          description: 'Id',
        }
      }
    }
  }
}
const deleteById = {
  preValidation,
  preHandler,
  handler: relationController.deleteById,
  schema: {
    tags: ['Relation'],
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
          ...relationSchema.properties.id,
          description: 'Id',
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
