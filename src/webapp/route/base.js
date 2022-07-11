const fiqlDescription = `field you can define complex queries to filter objects. 
__All object and sub-object properties are available to be used in your query__.

#### Example 
Request: '/entites?fiql=active==true;name==User'

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
=re= | Regular expressions. Available only for 'string' properties. <br /><br />Format: '('<regular expression>','<options: optional>')' <br /><br /> See details in [mongoDb docs](https://docs.mongodb.com/manual/reference/operator/query/regex/).`

const getListSchemaDefaultQueryProperty = () => {
  return {
    type: 'object',
    properties: {
      fields: {
        description:
          'Filter to select fields thar must be returned. Ex.: "?fields=id,name"',
        type: 'string',
        default: ''
      },
      fiql: {
        description: fiqlDescription,
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
  }
}

module.exports = {
  fiqlDescription,
  getListSchemaDefaultQueryProperty
}
