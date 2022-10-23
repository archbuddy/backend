const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')

let mongoServer

const connectMongo = async () => {
  if (mongoServer) {
    return mongoServer
  }
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
  return mongoServer
}

const disconnectMongo = async () => {
  /*
  const db = mongoose.connection.db
  const collections = await db.listCollections().toArray()
  collections
    .map((collection) => collection.name)
    .forEach(async (collectionName) => {
      db.dropCollection(collectionName)
    })
  */
  await mongoose.disconnect()
  await mongoServer.stop()
}

const mockFastifyRequest = (routerPath, body, query, params) => {
  return {
    routerPath,
    body,
    query,
    params,
    user: {
      email: 'test@mail.com',
      provider: 'google',
      id: '123'
    }
  }
}

const mockFastifyReply = (body) => {
  const reply = {
    value: 0,
    code: (code) => {
      this.value = code
      return reply
    },
    header: (key, value) => { return reply },
    send: (obj) => { return reply }
  }

  const spyCode = jest.spyOn(reply, 'code')
  const spyHeader = jest.spyOn(reply, 'header')
  const spySend = jest.spyOn(reply, 'send')

  return { reply, spyCode, spyHeader, spySend }
}

module.exports = {
  connectMongo,
  disconnectMongo,
  mockFastifyRequest,
  mockFastifyReply
}
