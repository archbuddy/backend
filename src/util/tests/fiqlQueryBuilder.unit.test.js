const { buildQuery } = require('../fiqlQueryBuilder')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const testData = require('./testData.json')

let mongoServer

const { Schema } = mongoose

const child = new Schema({
  _id: String,
  name: String,
  subChild: {
    type: Schema.Types.String,
    ref: 'child',
    relationship: {
      type: 'ONE_TO_ONE',
      localField: 'subChild',
      foreignField: '_id'
    }
  },
  parent: {
    type: Schema.Types.String,
    ref: 'parent',
    relationship: {
      type: 'ONE_TO_ONE',
      localField: 'parent',
      foreignField: '_id'
    }
  }
})
const childModel = mongoose.model('child', child, 'childs')

const parent = new Schema({
  _id: String,
  active: Boolean,
  name: String,
  otherChild: String,
  age: Number,
  includedAt: Date,
  nestedChild: child,
  childsArray: {
    type: Schema.Types.String,
    ref: childModel,
    relationship: {
      type: 'ONE_TO_MANY',
      localField: '_id',
      foreignField: 'parent'
    }
  },
  child: {
    type: Schema.Types.String,
    ref: childModel,
    relationship: {
      type: 'ONE_TO_ONE',
      localField: 'child',
      foreignField: '_id'
    }
  },
  child2: {
    type: Schema.Types.String,
    ref: childModel,
    relationship: {
      type: 'ONE_TO_ONE',
      localField: 'otherChild',
      foreignField: '_id'
    }
  }
})
const parentModel = mongoose.model('parent', parent, 'parents')

const connectMongo = async () => {
  mongoose.Promise = Promise
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  const mongooseOpts = {
    useNewUrlParser: true,
    dbName: 'fiqlQueryBuilderTest'
  }

  const connectionPromise = mongoose.connect(mongoUri, mongooseOpts)

  mongoose.connection.on('error', (e) => {
    if (e.message.code === 'ETIMEDOUT') {
      console.log(e)
      mongoose.connect(mongoUri, mongooseOpts)
    }
    console.log(e)
  })
  console.log(mongoUri)
  await connectionPromise
}

const initializeDatabase = async () => {
  let result = await childModel.insertMany(testData.childs)

  result = await parentModel.insertMany(testData.parents)

  return result
}

const disconnectMongo = async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
}

const dropCollections = async () => {
  await parentModel.deleteMany({})
  await childModel.deleteMany({})
}

describe('Query Builder', () => {
  beforeAll(async () => {
    await connectMongo()
    await initializeDatabase()
  })

  afterAll(async () => {
    try {
      await dropCollections()
      await disconnectMongo()
    } catch (error) {
      console.log(error)
    }
  })

  test('Default query', async () => {
    // ACT
    const result = await buildQuery(parentModel).pageQuery.exec()

    // ASSERT
    expect(result.length).toBe(7)
  })

  test('Limit', async () => {
    // ACT
    const result = await buildQuery(parentModel, { limit: 5 }).pageQuery.exec()

    // ASSERT
    expect(result.length).toBe(5)
  })

  test('Skip', async () => {
    // ACT
    const result = await buildQuery(parentModel, { limit: 1, skip: 1 }).pageQuery.exec()

    // ASSERT
    expect(result.length).toBe(1)
    expect(result[0]._id).toBe('P02')
  })

  describe('Select', () => {
    test('Select single field from document', async () => {
      // ARRANGE
      const select = 'name'

      // ACT
      const result = await buildQuery(parentModel, { fields: select }).pageQuery.exec()

      // ASSERT
      expect(result[0].name).toBe('Parent 1')
      expect(result[0].active).toBeUndefined()
    })

    test('Select multiple fields from document', async () => {
      // ARRANGE
      const select = 'name,active'

      // ACT
      const result = await buildQuery(parentModel, { fields: select }).pageQuery.exec()

      // ASSERT
      expect(result[0].name).toBe('Parent 1')
      expect(result[0].active).toBe(true)
      expect(result[0].age).toBeUndefined()
    })

    test('Select single field from subdocument', async () => {
      // ARRANGE
      const select = 'child.name'

      // ACT
      const result = await buildQuery(parentModel, { fields: select }).pageQuery.exec()

      // ASSERT
      expect(result[0].name).toBeUndefined()
      expect(result[0].child.name).toBe('Child 1')
      expect(result[0].child.parent).toBeUndefined()
    })

    test('Select single field from subdocument with property name change', async () => {
      // ARRANGE
      const select = 'child2.name'

      // ACT
      const result = await buildQuery(parentModel, { fields: select }).pageQuery.exec()

      // ASSERT
      expect(result[0].name).toBeUndefined()
      expect(result[0].child2.name).toBe('Child 2')
      expect(result[0].child2.parent).toBeUndefined()
    })

    test('Select multiple fields from subdocument', async () => {
      // ARRANGE
      const select = 'child.name,child.parent.name'

      // ACT
      const result = await buildQuery(parentModel, { fields: select }).pageQuery.exec()

      // ASSERT
      expect(result[0].name).toBeUndefined()
      expect(result[0].child.name).toBe('Child 1')
      expect(result[0].child.parent.name).toBe('Parent 1')
    })
  })

  describe('String queries', () => {
    test('String Equal To', async () => {
      // ARRANGE
      const fiql = "name=='Parent 1'"

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(1)
      expect(result[0].name).toBe('Parent 1')
    })

    test('String Not Equal To', async () => {
      // ARRANGE
      const fiql = "name!='Parent 1'"

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(6)
      expect(result[0].name).toBe('Parent 2')
    })

    test('String Greater Than', async () => {
      // ARRANGE
      const fiql = "name=gt='Parent 5'"

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(2)
      expect(result[0].name).toBe('Parent 6')
    })

    test('String Greater Than or Equal To', async () => {
      // ARRANGE
      const fiql = "name=ge='Parent 5'"

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(3)
      expect(result[0].name).toBe('Parent 5')
      expect(result[1].name).toBe('Parent 6')
    })

    test('String Less Than', async () => {
      // ARRANGE
      const fiql = "name=lt='Parent 2'"

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(1)
      expect(result[0].name).toBe('Parent 1')
    })
    test('Less Than Or Equal To', async () => {
      // ARRANGE
      const fiql = 'name=le=Parent%202'

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(2)
      expect(result[0].name).toBe('Parent 1')
      expect(result[1].name).toBe('Parent 2')
    })

    test('String Regex', async () => {
      // ARRANGE
      const fiql = "name=re=('.*blue.*',gi)"
      const fiql2 = "name=re='.*blue.*'"

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()
      const result2 = await buildQuery(parentModel, { fiql: fiql2 }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(1)
      expect(result2.length).toBe(1)
    })

    test('String Regex on sub document', async () => {
      // ARRANGE
      const fiql = "child.name=re=('1$',gi)"

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(1)
    })

    test('Regex query on non string field must return exception', async () => {
      // ARRANGE
      const fiql = 'age=re=15'

      // ACT
      const t = () => {
        buildQuery(parentModel, { fiql })
      }

      // ASSERT
      expect(t).toThrow('Regex is available only for string fields')
    })
  })

  describe('Number queries', () => {
    test('Number Equal To', async () => {
      // ARRANGE
      const fiql = 'age==20'

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(1)
      expect(result[0].age).toBe(20)
    })

    test('Number Not Equal To', async () => {
      // ARRANGE
      const fiql = 'age!=20'

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(6)
    })

    test('Number Greater Than', async () => {
      // ARRANGE
      const fiql = 'age=gt=20'

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(5)
    })

    test('Number Greater Than or Equal To', async () => {
      // ARRANGE
      const fiql = 'age=ge=20'

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(6)
    })

    test('Number Less Than', async () => {
      // ARRANGE
      const fiql = 'age=lt=20'

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(1)
      expect(result[0].name).toBe('Parent 1')
    })
    test('Number Less Than Or Equal To', async () => {
      // ARRANGE
      const fiql = 'age=le=20'

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(2)
      expect(result[0].name).toBe('Parent 1')
      expect(result[1].name).toBe('Parent 2')
    })
  })

  describe('Date queries', () => {
    test('Date Equal To', async () => {
      // ARRANGE
      const fiql = 'includedAt==1995-12-17T03:24:00.000-03:00'

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(1)
      expect(result[0].includedAt).toEqual(
        new Date('1995-12-17T03:24:00.000-03:00')
      )
    })

    test('Date Not Equal To', async () => {
      // ARRANGE
      const fiql = 'includedAt!=1995-12-17T03:24:00.000-03:00'

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(6)
    })

    test('Date Greater Than', async () => {
      // ARRANGE
      const fiql = 'includedAt=gt=1999-12-17T03:24:00.000-03:00'

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(1)
    })

    test('Date Greater Than or Equal To', async () => {
      // ARRANGE
      const fiql = 'includedAt=ge=1999-12-17T03:24:00.000-03:00'

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(2)
    })

    test('Date Less Than', async () => {
      // ARRANGE
      const fiql = 'includedAt=lt=1995-12-17T03:24:00.000-03:00'

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(1)
    })

    test('Date Less Than Or Equal To', async () => {
      // ARRANGE
      const fiql = 'includedAt=le=1995-12-17T03:24:00.000-03:00'

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(2)
    })
  })

  describe('Boolean queries', () => {
    test('Boolean Equals query', async () => {
      // ARRANGE
      const fiql = 'active==true'
      const fiql2 = 'active==0'

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()
      const result2 = await buildQuery(parentModel, { fiql: fiql2 }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(3)
      expect(result2.length).toBe(4)
    })
  })

  describe('Combination Queries', () => {
    test('Simple And Query', async () => {
      // ARRANGE
      const fiql = 'active==true;age==10'

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(1)
      expect(result[0].name).toBe('Parent 1')
    })

    test('Simple Or Query', async () => {
      // ARRANGE
      const fiql = 'active==false,age==10'

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(5)
    })

    test('Complex Combination Query', async () => {
      // ARRANGE
      const fiql = '(active==true;age==10),(active==false;age!=40)'

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(4)
    })
  })

  describe('Subdocuments Queries', () => {
    test('Query by nested subdocument', async () => {
      // ARRANJE
      const fiql = 'nestedChild._id==NC01'

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(1)
      expect(result[0]._id).toBe('P01')
    })

    test('Query by subdocument with lookup', async () => {
      // ARRANJE
      const fiql = 'child._id==C06'

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(2)
      expect(result[0]._id).toBe('P06')
      expect(result[1]._id).toBe('P07')
    })

    test('Query by subdocument in a subdocument with lookup', async () => {
      // ARRANJE
      const fiql = 'child.subChild._id==C02'

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(1)
      expect(result[0]._id).toBe('P01')
    })

    test('Complex Query by subdocument in a subdocument with lookup', async () => {
      // ARRANJE
      const fiql = 'child.subChild._id==C02,child.subChild._id==C03'

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(2)
      expect(result[0]._id).toBe('P01')
      expect(result[1]._id).toBe('P02')
    })

    test('Query by in subdocument array with lookup', async () => {
      // ARRANJE
      const fiql = 'childsArray._id==C02'

      // ACT
      const result = await buildQuery(parentModel, { fiql }).pageQuery.exec()

      // ASSERT
      expect(result.length).toBe(1)
      expect(result[0]._id).toBe('P02')
    })
  })
})
